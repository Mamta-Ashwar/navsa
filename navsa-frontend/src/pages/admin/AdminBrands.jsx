import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  bulkHideBrands,
  bulkRestoreBrands,
  bulkShowBrands,
  bulkSoftDeleteBrands,
  createBrand,
  getBrands,
  hardDeleteBrand,
  restoreBrand,
  softDeleteBrand,
  updateBrand,
} from "../../services/adminApi";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Eye,
  EyeOff,
  Link2,
  Plus,
  RotateCcw,
  Search,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import ConfirmModal from "../../components/common/ConfirmModal";
import "./AdminBrands.css";

const PAGE_SIZE = 50;

function BrandDetailModal({ brand, onClose }) {
  const deleted = Boolean(brand.deleted);
  const statusLabel = deleted ? "Deleted" : brand.status ? "Active" : "Hidden";
  const statusClass = deleted
    ? "admin-brands-status is-deleted"
    : brand.status
      ? "admin-brands-status is-active"
      : "admin-brands-status is-hidden";

  const rows = [
    ["ID", brand.id],
    ["Brand Name", brand.brand_name],
    ["Status", statusLabel],
    ["Products", brand.products_count ?? 0],
    [
      "Created",
      brand.created_at ? new Date(brand.created_at).toLocaleString() : "—",
    ],
    [
      "Last Updated",
      brand.updated_at ? new Date(brand.updated_at).toLocaleString() : "—",
    ],
  ];

  return (
    <div className="admin-brands-modal-backdrop" onMouseDown={onClose}>
      <section
        className="admin-brands-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Brand details for ${brand.brand_name}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="admin-brands-modal__close"
          onClick={onClose}
          aria-label="Close brand details"
        >
          <X size={18} />
        </button>

        <div className="admin-brands-modal__head">
          <div className="admin-brands-modal__icon">
            <Tags size={22} />
          </div>
          <div>
            <h2>{brand.brand_name}</h2>
            <span className={statusClass}>{statusLabel}</span>
          </div>
        </div>

        <div className="admin-brands-modal__details">
          {rows.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{String(value)}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BrandRow({
  brand,
  checked,
  busy,
  onToggleSelected,
  onSave,
  onRequestAction,
  onView,
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(brand.brand_name);
  const deleted = Boolean(brand.deleted);
  const productsCount = Number(brand.products_count ?? 0);

  useEffect(() => {
    setName(brand.brand_name);
  }, [brand.brand_name]);

  const save = async () => {
    const cleanName = name.trim();
    if (!cleanName || busy || deleted) return;

    const ok = await onSave(brand, cleanName);
    if (ok) setEditing(false);
  };

  const statusLabel = deleted ? "Deleted" : brand.status ? "Active" : "Hidden";
  const statusClass = deleted
    ? "admin-brands-status is-deleted"
    : brand.status
      ? "admin-brands-status is-active"
      : "admin-brands-status is-hidden";

  return (
    <tr
      className={[
        "admin-brands-row",
        checked ? "is-selected" : "",
        deleted ? "is-deleted" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onView}
    >
      <td
        className="admin-brands-cell-check"
        onClick={(event) => event.stopPropagation()}
      >
        <label className="admin-brands-checkbox">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onToggleSelected(brand.id)}
            aria-label={`Select ${brand.brand_name}`}
          />
          <span>
            <Check size={13} />
          </span>
        </label>
      </td>

      <td>
        {editing ? (
          <div
            className="admin-brands-edit"
            onClick={(event) => event.stopPropagation()}
          >
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") save();
                if (event.key === "Escape") {
                  setName(brand.brand_name);
                  setEditing(false);
                }
              }}
              disabled={busy}
              autoFocus
            />
            <button
              type="button"
              className="is-save"
              disabled={busy || !name.trim()}
              onClick={save}
              title="Save brand name"
            >
              <Check size={15} />
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setName(brand.brand_name);
                setEditing(false);
              }}
              title="Cancel editing"
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <div className="admin-brands-name">
            <span>{brand.brand_name}</span>
            <small>Brand ID #{brand.id}</small>
          </div>
        )}
      </td>

      <td>
        <span className="admin-brands-products">
          {productsCount.toLocaleString()}
        </span>
      </td>

      <td>
        <span className={statusClass}>{statusLabel}</span>
      </td>

      <td onClick={(event) => event.stopPropagation()}>
        <div className="admin-brands-actions">
          {deleted ? (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => onRequestAction(brand, "restore")}
                title="Restore brand"
                className="is-restore"
              >
                <RotateCcw size={16} />
              </button>

              <button
                type="button"
                disabled={busy || productsCount > 0}
                onClick={() => onRequestAction(brand, "permanent-delete")}
                title={
                  productsCount > 0
                    ? "Permanent delete is blocked while products use this brand"
                    : "Permanently delete brand"
                }
                className="is-hard-delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <>
              {!editing && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setEditing(true)}
                  title="Edit brand"
                  className="is-edit"
                >
                  <Edit2 size={16} />
                </button>
              )}

              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  onRequestAction(brand, brand.status ? "hide" : "show")
                }
                title={brand.status ? "Hide brand" : "Show brand"}
                className={brand.status ? "is-hide" : "is-show"}
              >
                {brand.status ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

              <button
                type="button"
                disabled={busy}
                onClick={() => onRequestAction(brand, "delete")}
                title="Move to deleted brands"
                className="is-delete"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}

export default function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [actionBusyId, setActionBusyId] = useState(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [confirmationBusy, setConfirmationBusy] = useState(false);
  const messageTimerRef = useRef(null);

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });

    window.clearTimeout(messageTimerRef.current);
    messageTimerRef.current = window.setTimeout(() => {
      setMessage(null);
    }, 5000);
  }, []);

  useEffect(() => {
    return () => {
      window.clearTimeout(messageTimerRef.current);
    };
  }, []);

  const load = useCallback(async () => {
    setLoading(true);

    try {
      // Admin needs the complete collection so the Deleted tab can restore records.
      const response = await getBrands({ show_deleted: 1 });
      const rows = Array.isArray(response) ? response : [];
      const validIds = new Set(rows.map((brand) => Number(brand.id)));

      setBrands(rows);
      setSelectedIds((current) =>
        new Set([...current].filter((id) => validIds.has(Number(id))))
      );
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    load();
  }, [load]);

  const availableBrands = useMemo(
    () => brands.filter((brand) => !Boolean(brand.deleted)),
    [brands]
  );
  const deletedBrands = useMemo(
    () => brands.filter((brand) => Boolean(brand.deleted)),
    [brands]
  );
  const activeBrands = useMemo(
    () =>
      availableBrands.filter((brand) => Boolean(brand.status)).length,
    [availableBrands]
  );
  const hiddenBrands = availableBrands.length - activeBrands;
  const linkedBrands = useMemo(
    () => brands.filter((brand) => Number(brand.products_count ?? 0) > 0).length,
    [brands]
  );

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();

    return brands.filter((brand) => {
      const deleted = Boolean(brand.deleted);
      const matchesSearch =
        !query ||
        (brand.brand_name || "").toLowerCase().includes(query) ||
        String(brand.id).includes(query);

      const productsCount = Number(brand.products_count ?? 0);
      const matchesStatus =
        (statusFilter === "all" && !deleted) ||
        (statusFilter === "active" && !deleted && Boolean(brand.status)) ||
        (statusFilter === "hidden" && !deleted && !Boolean(brand.status)) ||
        (statusFilter === "deleted" && deleted) ||
        (statusFilter === "linked" && productsCount > 0);

      return matchesSearch && matchesStatus;
    });
  }, [brands, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    // Never carry a mixed selection between normal and Deleted tabs.
    setSelectedIds(new Set());
  }, [statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const pageBrands = filteredBrands.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const filteredIds = useMemo(
    () => filteredBrands.map((brand) => Number(brand.id)),
    [filteredBrands]
  );

  const allFilteredSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
  const selectedCount = selectedIds.size;
  const selectedBrands = useMemo(
    () => brands.filter((brand) => selectedIds.has(Number(brand.id))),
    [brands, selectedIds]
  );
  const selectedHasDeleted = selectedBrands.some((brand) => Boolean(brand.deleted));
  const selectedHasAvailable = selectedBrands.some((brand) => !Boolean(brand.deleted));
  const mixedDeletedSelection = selectedHasDeleted && selectedHasAvailable;

  const chooseFilter = (value) => {
    // Summary cards are navigation controls: clicking one always shows the full
    // requested group, not a leftover search result from the previous view.
    setSearch("");
    setSelectedIds(new Set());
    setCurrentPage(1);
    setStatusFilter(value);
  };

  const toggleSelected = (id) => {
    const numericId = Number(id);

    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(numericId)) next.delete(numericId);
      else next.add(numericId);
      return next;
    });
  };

  const toggleAllFiltered = () => {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (allFilteredSelected) filteredIds.forEach((id) => next.delete(id));
      else filteredIds.forEach((id) => next.add(id));

      return next;
    });
  };

  const addBrand = async () => {
    const cleanName = newName.trim();
    if (!cleanName || adding) return;

    setAdding(true);
    try {
      await createBrand(cleanName);
      setNewName("");
      showMessage("success", `"${cleanName}" was added.`);
      await load();
    } catch (error) {
      showMessage("error", error.message);
    } finally {
      setAdding(false);
    }
  };

  const saveBrand = async (brand, cleanName) => {
    setActionBusyId(Number(brand.id));

    try {
      await updateBrand(brand.id, {
        brand_name: cleanName,
        status: brand.status ? 1 : 0,
      });
      showMessage("success", `"${cleanName}" was updated.`);
      await load();
      return true;
    } catch (error) {
      showMessage("error", error.message);
      return false;
    } finally {
      setActionBusyId(null);
    }
  };

  const openConfirmation = (config) => {
    if (confirmationBusy) return;
    setConfirmation(config);
  };

  const requestBrandAction = (brand, action) => {
    const brandName = brand.brand_name;
    const productsCount = Number(brand.products_count ?? 0);

    if (action === "permanent-delete" && productsCount > 0) {
      showMessage(
        "error",
        `"${brandName}" cannot be permanently deleted while ${productsCount.toLocaleString()} product${
          productsCount === 1 ? " is" : "s are"
        } assigned to it.`
      );
      return;
    }

    const configs = {
      hide: {
        eyebrow: "BRAND VISIBILITY",
        title: "Hide this brand?",
        message: (
          <>
            <strong>{brandName}</strong> will be removed from the public brand
            directory.
          </>
        ),
        description: "The brand stays in Admin and can be shown again at any time.",
        confirmText: "Hide Brand",
        icon: <EyeOff size={29} />,
        variant: "warning",
        action: () =>
          updateBrand(brand.id, { brand_name: brandName, status: 0 }),
        success: `"${brandName}" is now hidden from the public brand directory.`,
      },
      show: {
        eyebrow: "BRAND VISIBILITY",
        title: "Show this brand?",
        message: (
          <>
            <strong>{brandName}</strong> will become visible in the public brand
            directory.
          </>
        ),
        description: "Customers will be able to find this brand from the Brands page.",
        confirmText: "Show Brand",
        icon: <Eye size={29} />,
        variant: "success",
        action: () =>
          updateBrand(brand.id, { brand_name: brandName, status: 1 }),
        success: `"${brandName}" is now visible in the public brand directory.`,
      },
      delete: {
        eyebrow: "MOVE TO DELETED",
        title: "Delete this brand?",
        message: (
          <>
            <strong>{brandName}</strong> will move to the Deleted tab. Existing
            product assignments are kept.
          </>
        ),
        description:
          "This is not permanent. You can restore the brand later from Deleted brands.",
        confirmText: "Move to Deleted",
        icon: <Trash2 size={29} />,
        variant: "warning",
        action: () => softDeleteBrand(brand.id),
        success: `"${brandName}" was moved to Deleted brands.`,
      },
      restore: {
        eyebrow: "RESTORE BRAND",
        title: "Restore this brand?",
        message: (
          <>
            <strong>{brandName}</strong> will return to the normal Brands list.
          </>
        ),
        description:
          "For safety it remains hidden after restore. Use Show when you want it public again.",
        confirmText: "Restore Brand",
        icon: <RotateCcw size={29} />,
        variant: "success",
        action: () => restoreBrand(brand.id),
        success: `"${brandName}" was restored and is currently hidden.`,
      },
      "permanent-delete": {
        eyebrow: "PERMANENT DELETE",
        title: "Permanently delete this brand?",
        message: (
          <>
            <strong>{brandName}</strong> will be removed from the database.
          </>
        ),
        description: "This cannot be undone. Only deleted brands with no products can be removed permanently.",
        confirmText: "Delete Permanently",
        icon: <Trash2 size={29} />,
        variant: "danger",
        action: () => hardDeleteBrand(brand.id),
        success: `"${brandName}" was permanently deleted.`,
      },
    };

    const config = configs[action];
    if (!config) return;

    openConfirmation({
      ...config,
      brandId: Number(brand.id),
      afterSuccess: () => {
        setSelectedIds((current) => {
          const next = new Set(current);
          next.delete(Number(brand.id));
          return next;
        });
      },
    });
  };

  const requestBulkAction = (action) => {
    if (selectedCount === 0 || bulkBusy || confirmationBusy) return;

    const ids = [...selectedIds];
    const countLabel = `${selectedCount.toLocaleString()} selected brand${
      selectedCount === 1 ? "" : "s"
    }`;

    const configs = {
      hide: {
        eyebrow: "BULK VISIBILITY",
        title: "Hide selected brands?",
        message: (
          <>
            <strong>{countLabel}</strong> will be hidden from the public brand
            directory.
          </>
        ),
        description: "They remain in Admin and can be shown again later.",
        confirmText: "Hide Selected",
        icon: <EyeOff size={29} />,
        variant: "warning",
        action: () => bulkHideBrands({ ids }),
      },
      show: {
        eyebrow: "BULK VISIBILITY",
        title: "Show selected brands?",
        message: (
          <>
            <strong>{countLabel}</strong> will become visible in the public brand
            directory.
          </>
        ),
        description: "Use this only for brands that should be customer-visible.",
        confirmText: "Show Selected",
        icon: <Eye size={29} />,
        variant: "success",
        action: () => bulkShowBrands({ ids }),
      },
      delete: {
        eyebrow: "BULK DELETE",
        title: "Move selected brands to Deleted?",
        message: (
          <>
            <strong>{countLabel}</strong> will move to the Deleted tab. Product
            assignments are preserved.
          </>
        ),
        description: "This is reversible and does not permanently delete database rows.",
        confirmText: "Move to Deleted",
        icon: <Trash2 size={29} />,
        variant: "warning",
        action: () => bulkSoftDeleteBrands({ ids }),
      },
      restore: {
        eyebrow: "BULK RESTORE",
        title: "Restore selected brands?",
        message: (
          <>
            <strong>{countLabel}</strong> will return to the normal Brands list.
          </>
        ),
        description: "Restored brands remain hidden until you explicitly choose Show.",
        confirmText: "Restore Selected",
        icon: <RotateCcw size={29} />,
        variant: "success",
        action: () => bulkRestoreBrands({ ids }),
      },
    };

    const config = configs[action];
    if (!config) return;

    openConfirmation({
      ...config,
      isBulk: true,
      afterSuccess: () => setSelectedIds(new Set()),
    });
  };

  const confirmAction = async () => {
    if (!confirmation || confirmationBusy) return;

    const current = confirmation;
    setConfirmationBusy(true);
    if (current.isBulk) setBulkBusy(true);
    else if (current.brandId) setActionBusyId(current.brandId);

    try {
      const result = await current.action();
      current.afterSuccess?.();
      showMessage(
        "success",
        result?.message || current.success || "Brand action completed."
      );
      await load();
    } catch (error) {
      showMessage("error", error.message || "Unable to update the brand.");
    } finally {
      setConfirmationBusy(false);
      setBulkBusy(false);
      setActionBusyId(null);
      setConfirmation(null);
    }
  };

  const rangeStart =
    filteredBrands.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredBrands.length);

  return (
    <div className="admin-brands-page">
      {selectedBrand && (
        <BrandDetailModal
          brand={selectedBrand}
          onClose={() => setSelectedBrand(null)}
        />
      )}

      <ConfirmModal
        open={Boolean(confirmation)}
        title={confirmation?.title}
        message={confirmation?.message}
        description={confirmation?.description}
        confirmText={confirmation?.confirmText}
        cancelText="Cancel"
        eyebrow={confirmation?.eyebrow}
        icon={confirmation?.icon}
        variant={confirmation?.variant || "danger"}
        loading={confirmationBusy}
        closeOnBackdrop={!confirmationBusy}
        onConfirm={confirmAction}
        onClose={() => {
          if (!confirmationBusy) setConfirmation(null);
        }}
      />

      <div className="admin-brands-heading">
        <div>
          <span>Catalogue directory</span>
          <h1>Brands</h1>
          <p>Manage brand visibility, deleted records and product links.</p>
        </div>
      </div>

      {message && (
        <div
          className={
            message.type === "error"
              ? "admin-brands-message is-error"
              : "admin-brands-message is-success"
          }
          role="status"
        >
          {message.type === "error" ? (
            <X size={17} />
          ) : (
            <CheckCircle2 size={17} />
          )}
          <span>{message.text}</span>
          <button
            type="button"
            onClick={() => setMessage(null)}
            aria-label="Dismiss message"
          >
            <X size={15} />
          </button>
        </div>
      )}

      <section className="admin-brands-stats" aria-label="Brand totals and quick filters">
        <button
          type="button"
          className={`admin-brands-stat-card ${statusFilter === "all" ? "is-selected" : ""}`}
          onClick={() => chooseFilter("all")}
          aria-pressed={statusFilter === "all"}
        >
          <div className="is-blue">
            <Tags size={19} />
          </div>
          <span>Available brands</span>
          <strong>{availableBrands.length.toLocaleString()}</strong>
          <small>Active + hidden, excluding Deleted</small>
        </button>

        <button
          type="button"
          className={`admin-brands-stat-card ${statusFilter === "active" ? "is-selected" : ""}`}
          onClick={() => chooseFilter("active")}
          aria-pressed={statusFilter === "active"}
        >
          <div className="is-green">
            <CheckCircle2 size={19} />
          </div>
          <span>Active</span>
          <strong>{activeBrands.toLocaleString()}</strong>
          <small>Visible in public brand directory</small>
        </button>

        <button
          type="button"
          className={`admin-brands-stat-card ${statusFilter === "hidden" ? "is-selected" : ""}`}
          onClick={() => chooseFilter("hidden")}
          aria-pressed={statusFilter === "hidden"}
        >
          <div className="is-amber">
            <EyeOff size={19} />
          </div>
          <span>Hidden</span>
          <strong>{hiddenBrands.toLocaleString()}</strong>
          <small>Kept in admin, hidden publicly</small>
        </button>

        <button
          type="button"
          className={`admin-brands-stat-card ${statusFilter === "deleted" ? "is-selected" : ""}`}
          onClick={() => chooseFilter("deleted")}
          aria-pressed={statusFilter === "deleted"}
        >
          <div className="is-red">
            <Trash2 size={19} />
          </div>
          <span>Deleted</span>
          <strong>{deletedBrands.length.toLocaleString()}</strong>
          <small>Recoverable until permanently deleted</small>
        </button>

        <button
          type="button"
          className={`admin-brands-stat-card ${statusFilter === "linked" ? "is-selected" : ""}`}
          onClick={() => chooseFilter("linked")}
          aria-pressed={statusFilter === "linked"}
        >
          <div className="is-cyan">
            <Link2 size={19} />
          </div>
          <span>Linked to products</span>
          <strong>{linkedBrands.toLocaleString()}</strong>
          <small>Includes links to recoverable brands</small>
        </button>
      </section>

      <section className="admin-brands-add">
        <div>
          <span className="admin-brands-add__label">Add a new brand</span>
          <div className="admin-brands-add__input">
            <Tags size={17} />
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Enter brand name..."
              onKeyDown={(event) => {
                if (event.key === "Enter") addBrand();
              }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={addBrand}
          disabled={adding || !newName.trim()}
        >
          <Plus size={17} />
          {adding ? "Adding…" : "Add Brand"}
        </button>
      </section>

      <section className="admin-brands-toolbar">
        <div className="admin-brands-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search brands or ID..."
            aria-label="Search admin brands"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear brand search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="admin-brands-filters" aria-label="Brand status filter">
          {[
            ["all", "All"],
            ["active", "Active"],
            ["hidden", "Hidden"],
            ["deleted", `Deleted (${deletedBrands.length.toLocaleString()})`],
            ["linked", `Linked (${linkedBrands.toLocaleString()})`],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={statusFilter === value ? "is-active" : ""}
              onClick={() => setStatusFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="admin-brands-toolbar__result">
          {filteredBrands.length.toLocaleString()} matching
        </div>
      </section>

      {selectedCount > 0 && (
        <section className="admin-brands-bulk">
          <div>
            <strong>{selectedCount.toLocaleString()} selected</strong>
            <span>
              {allFilteredSelected
                ? `All ${filteredBrands.length.toLocaleString()} matching brands are selected`
                : "Choose a bulk action for the selected brands"}
            </span>
          </div>

          <div className="admin-brands-bulk__actions">
            {mixedDeletedSelection ? (
              <span className="admin-brands-bulk__mixed-note">
                Mixed available/deleted selection — filter the list before running a bulk action.
              </span>
            ) : selectedHasDeleted ? (
              <button
                type="button"
                className="is-restore"
                disabled={bulkBusy}
                onClick={() => requestBulkAction("restore")}
              >
                <RotateCcw size={16} />
                Restore
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="is-show"
                  disabled={bulkBusy}
                  onClick={() => requestBulkAction("show")}
                >
                  <Eye size={16} />
                  Show
                </button>

                <button
                  type="button"
                  className="is-hide"
                  disabled={bulkBusy}
                  onClick={() => requestBulkAction("hide")}
                >
                  <EyeOff size={16} />
                  Hide
                </button>

                <button
                  type="button"
                  className="is-delete"
                  disabled={bulkBusy}
                  onClick={() => requestBulkAction("delete")}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            )}

            <button
              type="button"
              className="is-clear"
              disabled={bulkBusy}
              onClick={() => setSelectedIds(new Set())}
            >
              <X size={16} />
              Clear
            </button>
          </div>
        </section>
      )}

      <section className="admin-brands-table-panel">
        {loading ? (
          <div className="admin-brands-loading">
            <span />
            Loading brands…
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="admin-brands-empty">
            <Search size={26} />
            <strong>
              {statusFilter === "deleted"
                ? "No deleted brands"
                : statusFilter === "linked"
                  ? "No brands linked to products"
                  : "No brands found"}
            </strong>
            <p>
              {statusFilter === "deleted"
                ? "Deleted brands will appear here until restored or permanently deleted."
                : statusFilter === "linked"
                  ? "Brands with one or more assigned products will appear here."
                  : "Try changing the search text or status filter."}
            </p>
          </div>
        ) : (
          <>
            <div className="admin-brands-table-scroll">
              <table className="admin-brands-table">
                <thead>
                  <tr>
                    <th className="admin-brands-cell-check">
                      <label
                        className="admin-brands-checkbox"
                        title={`Select all ${filteredBrands.length.toLocaleString()} matching brands`}
                      >
                        <input
                          type="checkbox"
                          checked={allFilteredSelected}
                          onChange={toggleAllFiltered}
                          aria-label={`Select all ${filteredBrands.length} matching brands`}
                        />
                        <span>
                          <Check size={13} />
                        </span>
                      </label>
                    </th>
                    <th>Brand Name</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {pageBrands.map((brand) => (
                    <BrandRow
                      key={brand.id}
                      brand={brand}
                      checked={selectedIds.has(Number(brand.id))}
                      busy={actionBusyId === Number(brand.id)}
                      onToggleSelected={toggleSelected}
                      onSave={saveBrand}
                      onRequestAction={requestBrandAction}
                      onView={() => setSelectedBrand(brand)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="admin-brands-table-footer">
              <span>
                Showing {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of{" "}
                {filteredBrands.length.toLocaleString()} matching brands
              </span>

              <div>
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                >
                  <ChevronLeft size={15} />
                </button>

                <span>
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
