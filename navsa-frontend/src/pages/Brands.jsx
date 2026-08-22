// import { useEffect, useMemo, useRef, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   X,
// } from "lucide-react";
// import "./Brands.css";

// // Load every brand logo currently present in src/assets/brands/.
// const imageModules = import.meta.glob(
//   "../assets/brands/*.{png,jpg,jpeg,svg,webp}",
//   { eager: true }
// );

// const normalizeBrandKey = (value = "") =>
//   value.toLowerCase().replace(/[^a-z0-9]/g, "");

// const imageByKey = new Map();

// Object.entries(imageModules).forEach(([path, mod]) => {
//   const filename = path.split("/").pop()?.replace(/\.[^/.]+$/, "") || "";
//   const key = normalizeBrandKey(filename);

//   if (key && !imageByKey.has(key)) {
//     imageByKey.set(key, mod.default);
//   }
// });

// function findLogo(brandName) {
//   const key = normalizeBrandKey(brandName);

//   if (!key) return null;

//   // Use only an exact normalized match. Normalisation already handles
//   // spaces, underscores, apostrophes and punctuation. Avoiding fuzzy
//   // matching prevents one brand from accidentally receiving another logo.
//   return imageByKey.get(key) || null;
// }

// function BrandLogo({ brandName }) {
//   const [failed, setFailed] = useState(false);
//   const logo = findLogo(brandName);

//   if (!logo || failed) {
//     return (
//       <div className="brands-directory-card__fallback" aria-hidden="true">
//         {brandName?.trim()?.charAt(0)?.toUpperCase() || "?"}
//       </div>
//     );
//   }

//   return (
//     <img
//       className="brands-directory-card__logo"
//       src={logo}
//       alt={`${brandName} logo`}
//       loading="lazy"
//       onError={() => setFailed(true)}
//     />
//   );
// }

// function buildPagination(currentPage, totalPages) {
//   if (totalPages <= 7) {
//     return Array.from({ length: totalPages }, (_, index) => index + 1);
//   }

//   const pages = new Set([
//     1,
//     totalPages,
//     currentPage,
//     currentPage - 1,
//     currentPage + 1,
//   ]);

//   const validPages = [...pages]
//     .filter((page) => page >= 1 && page <= totalPages)
//     .sort((a, b) => a - b);

//   const items = [];

//   validPages.forEach((page, index) => {
//     const previous = validPages[index - 1];

//     if (previous && page - previous > 1) {
//       items.push(`ellipsis-${previous}-${page}`);
//     }

//     items.push(page);
//   });

//   return items;
// }

// export default function Brands() {
//   const [brands, setBrands] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");
//   const [search, setSearch] = useState("");
//   const [selectedLetter, setSelectedLetter] = useState("ALL");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [suggestionsOpen, setSuggestionsOpen] = useState(false);
//   const [activeSuggestion, setActiveSuggestion] = useState(-1);

//   const searchWrapRef = useRef(null);

//   const brandsPerPage = 48;
//   const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

//   useEffect(() => {
//     const BASE = import.meta.env.VITE_API_URL || "/api";
//     const controller = new AbortController();

//     setLoading(true);
//     setLoadError("");

//     fetch(`${BASE}/brands`, {
//       headers: { Accept: "application/json" },
//       signal: controller.signal,
//     })
//       .then(async (response) => {
//         const data = await response.json().catch(() => []);

//         if (!response.ok) {
//           throw new Error(data.message || `Unable to load brands (${response.status})`);
//         }

//         return Array.isArray(data) ? data : [];
//       })
//       .then((data) => {
//         setBrands(data);
//       })
//       .catch((error) => {
//         if (error.name !== "AbortError") {
//           setLoadError(error.message || "Unable to load brands.");
//         }
//       })
//       .finally(() => {
//         if (!controller.signal.aborted) {
//           setLoading(false);
//         }
//       });

//     return () => controller.abort();
//   }, []);

//   useEffect(() => {
//     const handlePointerDown = (event) => {
//       if (
//         searchWrapRef.current &&
//         !searchWrapRef.current.contains(event.target)
//       ) {
//         setSuggestionsOpen(false);
//         setActiveSuggestion(-1);
//       }
//     };

//     document.addEventListener("mousedown", handlePointerDown);

//     return () => document.removeEventListener("mousedown", handlePointerDown);
//   }, []);

//   const query = search.trim().toLowerCase();
//   const isSearching = query.length > 0;

//   const letterCounts = useMemo(() => {
//     const counts = Object.fromEntries(alphabet.map((letter) => [letter, 0]));

//     brands.forEach((brand) => {
//       const firstLetter = (brand.brand_name || "").trim().charAt(0).toUpperCase();

//       if (counts[firstLetter] !== undefined) {
//         counts[firstLetter] += 1;
//       }
//     });

//     return counts;
//   }, [brands]);

//   const filteredBrands = useMemo(() => {
//     return brands.filter((brand) => {
//       const name = (brand.brand_name || "").trim();
//       const lowerName = name.toLowerCase();

//       // Search always runs across ALL brands. It must not be trapped inside
//       // the previously selected alphabet letter.
//       if (isSearching) {
//         return lowerName.includes(query);
//       }

//       if (selectedLetter === "ALL") {
//         return true;
//       }

//       return name.toUpperCase().startsWith(selectedLetter);
//     });
//   }, [brands, isSearching, query, selectedLetter]);

//   const suggestions = useMemo(() => {
//     if (query.length < 2) return [];

//     return brands
//       .filter((brand) =>
//         (brand.brand_name || "").toLowerCase().includes(query)
//       )
//       .sort((a, b) => {
//         const aName = (a.brand_name || "").toLowerCase();
//         const bName = (b.brand_name || "").toLowerCase();
//         const aStarts = aName.startsWith(query);
//         const bStarts = bName.startsWith(query);

//         if (aStarts !== bStarts) return aStarts ? -1 : 1;
//         return aName.localeCompare(bName);
//       })
//       .slice(0, 8);
//   }, [brands, query]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredBrands.length / brandsPerPage)
//   );

//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(totalPages);
//     }
//   }, [currentPage, totalPages]);

//   const displayedBrands = filteredBrands.slice(
//     (currentPage - 1) * brandsPerPage,
//     currentPage * brandsPerPage
//   );

//   const pageItems = buildPagination(currentPage, totalPages);
//   const rangeStart =
//     filteredBrands.length === 0
//       ? 0
//       : (currentPage - 1) * brandsPerPage + 1;
//   const rangeEnd = Math.min(
//     currentPage * brandsPerPage,
//     filteredBrands.length
//   );

//   const chooseLetter = (letter) => {
//     setSelectedLetter(letter);
//     setSearch("");
//     setCurrentPage(1);
//     setSuggestionsOpen(false);
//     setActiveSuggestion(-1);
//   };

//   const handleSearchChange = (event) => {
//     const value = event.target.value;

//     setSearch(value);
//     setCurrentPage(1);
//     setActiveSuggestion(-1);

//     // Searching is global, so visually return the alphabet filter to ALL.
//     if (value.trim()) {
//       setSelectedLetter("ALL");
//     }

//     setSuggestionsOpen(value.trim().length >= 2);
//   };

//   const applySuggestion = (brand) => {
//     setSearch(brand.brand_name || "");
//     setSelectedLetter("ALL");
//     setCurrentPage(1);
//     setSuggestionsOpen(false);
//     setActiveSuggestion(-1);
//   };

//   const clearSearch = () => {
//     setSearch("");
//     setSelectedLetter("ALL");
//     setCurrentPage(1);
//     setSuggestionsOpen(false);
//     setActiveSuggestion(-1);
//   };

//   const handleSearchKeyDown = (event) => {
//     if (!suggestionsOpen || suggestions.length === 0) {
//       if (event.key === "Escape") {
//         setSuggestionsOpen(false);
//       }
//       return;
//     }

//     if (event.key === "ArrowDown") {
//       event.preventDefault();
//       setActiveSuggestion((current) =>
//         current < suggestions.length - 1 ? current + 1 : 0
//       );
//     }

//     if (event.key === "ArrowUp") {
//       event.preventDefault();
//       setActiveSuggestion((current) =>
//         current > 0 ? current - 1 : suggestions.length - 1
//       );
//     }

//     if (event.key === "Enter" && activeSuggestion >= 0) {
//       event.preventDefault();
//       applySuggestion(suggestions[activeSuggestion]);
//     }

//     if (event.key === "Escape") {
//       setSuggestionsOpen(false);
//       setActiveSuggestion(-1);
//     }
//   };

//   return (
//     <main className="brands-directory-page">
//       <section className="brands-directory-shell">
//         <header className="brands-directory-hero">
//           <span className="brands-directory-hero__eyebrow">
//             NAVSA BRAND DIRECTORY
//           </span>
//           <h1>Brands</h1>
//           <p>
//             Browse our active wholesale brand directory and open the matching
//             product range.
//           </p>

//           <div className="brands-directory-hero__count">
//             <strong>{brands.length.toLocaleString()}</strong>
//             <span>active brands</span>
//           </div>
//         </header>

//         <section
//           className="brands-directory-search-panel"
//           aria-label="Search and filter brands"
//         >
//           <div className="brands-directory-search" ref={searchWrapRef}>
//             <Search size={19} aria-hidden="true" />

//             <input
//               type="search"
//               value={search}
//               placeholder="Search brands..."
//               aria-label="Search brands"
//               aria-autocomplete="list"
//               aria-expanded={suggestionsOpen && suggestions.length > 0}
//               onChange={handleSearchChange}
//               onFocus={() => {
//                 if (query.length >= 2) setSuggestionsOpen(true);
//               }}
//               onKeyDown={handleSearchKeyDown}
//             />

//             {search && (
//               <button
//                 type="button"
//                 className="brands-directory-search__clear"
//                 onClick={clearSearch}
//                 aria-label="Clear brand search"
//               >
//                 <X size={17} />
//               </button>
//             )}

//             {suggestionsOpen && query.length >= 2 && (
//               <div
//                 className="brands-directory-suggestions"
//                 role="listbox"
//                 aria-label="Brand suggestions"
//               >
//                 {suggestions.length > 0 ? (
//                   suggestions.map((brand, index) => (
//                     <button
//                       key={brand.id}
//                       type="button"
//                       role="option"
//                       aria-selected={activeSuggestion === index}
//                       className={
//                         activeSuggestion === index
//                           ? "brands-directory-suggestion is-active"
//                           : "brands-directory-suggestion"
//                       }
//                       onMouseDown={(event) => {
//                         event.preventDefault();
//                         applySuggestion(brand);
//                       }}
//                     >
//                       <span className="brands-directory-suggestion__mark">
//                         {brand.brand_name?.charAt(0)?.toUpperCase() || "?"}
//                       </span>
//                       <span>{brand.brand_name}</span>
//                     </button>
//                   ))
//                 ) : (
//                   <div className="brands-directory-suggestions__empty">
//                     No matching brand suggestions
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           <div className="brands-directory-alphabet" aria-label="Filter brands by letter">
//             <button
//               type="button"
//               className={
//                 selectedLetter === "ALL" && !isSearching
//                   ? "brands-directory-letter is-active"
//                   : "brands-directory-letter"
//               }
//               onClick={() => chooseLetter("ALL")}
//             >
//               ALL
//             </button>

//             {alphabet.map((letter) => {
//               const count = letterCounts[letter] || 0;

//               return (
//                 <button
//                   key={letter}
//                   type="button"
//                   title={`${count} brand${count === 1 ? "" : "s"} beginning with ${letter}`}
//                   disabled={count === 0}
//                   className={
//                     selectedLetter === letter && !isSearching
//                       ? "brands-directory-letter is-active"
//                       : "brands-directory-letter"
//                   }
//                   onClick={() => chooseLetter(letter)}
//                 >
//                   {letter}
//                 </button>
//               );
//             })}
//           </div>
//         </section>

//         <div className="brands-directory-results-head">
//           <div>
//             <strong>
//               {isSearching
//                 ? `Search results for “${search.trim()}”`
//                 : selectedLetter === "ALL"
//                   ? "All brands"
//                   : `Brands beginning with ${selectedLetter}`}
//             </strong>
//             <span>
//               {loading
//                 ? "Loading brand directory…"
//                 : `${filteredBrands.length.toLocaleString()} brand${
//                     filteredBrands.length === 1 ? "" : "s"
//                   } found`}
//             </span>
//           </div>

//           {!loading && filteredBrands.length > 0 && (
//             <span className="brands-directory-results-head__range">
//               Showing {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of{" "}
//               {filteredBrands.length.toLocaleString()}
//             </span>
//           )}
//         </div>

//         {loading ? (
//           <div className="brands-directory-state">
//             <span className="brands-directory-spinner" aria-hidden="true" />
//             <strong>Loading brands</strong>
//             <p>Please wait while the brand directory is prepared.</p>
//           </div>
//         ) : loadError ? (
//           <div className="brands-directory-state brands-directory-state--error">
//             <strong>Brand directory could not be loaded</strong>
//             <p>{loadError}</p>
//           </div>
//         ) : filteredBrands.length === 0 ? (
//           <div className="brands-directory-state">
//             <Search size={28} aria-hidden="true" />
//             <strong>No brands found</strong>
//             <p>
//               {search.trim()
//                 ? `No brand matches “${search.trim()}”. Try another spelling or clear the search.`
//                 : "There are no brands available for this filter."}
//             </p>
//             {search.trim() && (
//               <button type="button" onClick={clearSearch}>
//                 Clear search
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             <div className="brands-directory-grid">
//               {displayedBrands.map((brand) => (
//                 <Link
//                   key={brand.id}
//                   to={`/shop?brand=${encodeURIComponent(brand.brand_name)}`}
//                   className="brands-directory-card"
//                   title={`Shop ${brand.brand_name}`}
//                 >
//                   <div className="brands-directory-card__visual">
//                     <BrandLogo brandName={brand.brand_name} />
//                   </div>

//                   <div className="brands-directory-card__name">
//                     {brand.brand_name}
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             {totalPages > 1 && (
//               <nav
//                 className="brands-directory-pagination"
//                 aria-label="Brand directory pages"
//               >
//                 <button
//                   type="button"
//                   className="brands-directory-pagination__nav"
//                   disabled={currentPage === 1}
//                   onClick={() => {
//                     setCurrentPage((page) => Math.max(1, page - 1));
//                     window.scrollTo({ top: 0, behavior: "smooth" });
//                   }}
//                 >
//                   <ChevronLeft size={16} />
//                   Previous
//                 </button>

//                 <div className="brands-directory-pagination__pages">
//                   {pageItems.map((item) =>
//                     typeof item === "number" ? (
//                       <button
//                         key={item}
//                         type="button"
//                         aria-current={currentPage === item ? "page" : undefined}
//                         className={
//                           currentPage === item
//                             ? "brands-directory-page-number is-active"
//                             : "brands-directory-page-number"
//                         }
//                         onClick={() => {
//                           setCurrentPage(item);
//                           window.scrollTo({ top: 0, behavior: "smooth" });
//                         }}
//                       >
//                         {item}
//                       </button>
//                     ) : (
//                       <span key={item} className="brands-directory-pagination__ellipsis">
//                         …
//                       </span>
//                     )
//                   )}
//                 </div>

//                 <button
//                   type="button"
//                   className="brands-directory-pagination__nav"
//                   disabled={currentPage === totalPages}
//                   onClick={() => {
//                     setCurrentPage((page) =>
//                       Math.min(totalPages, page + 1)
//                     );
//                     window.scrollTo({ top: 0, behavior: "smooth" });
//                   }}
//                 >
//                   Next
//                   <ChevronRight size={16} />
//                 </button>
//               </nav>
//             )}
//           </>
//         )}
//       </section>
//     </main>
//   );
// }

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import "./Brands.css";

// Load every brand logo currently present in src/assets/brands/.
const imageModules = import.meta.glob(
  "../assets/brands/*.{png,jpg,jpeg,svg,webp}",
  { eager: true }
);

const normalizeBrandKey = (value = "") =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const imageByKey = new Map();

Object.entries(imageModules).forEach(([path, mod]) => {
  const filename = path.split("/").pop()?.replace(/\.[^/.]+$/, "") || "";
  const key = normalizeBrandKey(filename);

  if (key && !imageByKey.has(key)) {
    imageByKey.set(key, mod.default);
  }
});

function findLogo(brandName) {
  const key = normalizeBrandKey(brandName);

  if (!key) return null;

  // Use only an exact normalized match. Normalisation already handles
  // spaces, underscores, apostrophes and punctuation. Avoiding fuzzy
  // matching prevents one brand from accidentally receiving another logo.
  return imageByKey.get(key) || null;
}

function BrandLogo({ brandName }) {
  const [failed, setFailed] = useState(false);
  const logo = findLogo(brandName);

  if (!logo || failed) {
    return (
      <div className="brands-directory-card__fallback" aria-hidden="true">
        {brandName?.trim()?.charAt(0)?.toUpperCase() || "?"}
      </div>
    );
  }

  return (
    <img
      className="brands-directory-card__logo"
      src={logo}
      alt={`${brandName} logo`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function buildPagination(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage,
    currentPage - 1,
    currentPage + 1,
  ]);

  const validPages = [...pages]
    .filter((page) => page >= 1 && page <= totalPages)
    .sort((a, b) => a - b);

  const items = [];

  validPages.forEach((page, index) => {
    const previous = validPages[index - 1];

    if (previous && page - previous > 1) {
      items.push(`ellipsis-${previous}-${page}`);
    }

    items.push(page);
  });

  return items;
}

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const searchWrapRef = useRef(null);

  const brandsPerPage = 48;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    const BASE = import.meta.env.VITE_API_URL || "/api";
    const controller = new AbortController();

    setLoading(true);
    setLoadError("");

    fetch(`${BASE}/brands`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || `Unable to load brands (${response.status})`);
        }

        return Array.isArray(data) ? data : [];
      })
      .then((data) => {
        setBrands(data);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setLoadError(error.message || "Unable to load brands.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        searchWrapRef.current &&
        !searchWrapRef.current.contains(event.target)
      ) {
        setSuggestionsOpen(false);
        setActiveSuggestion(-1);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const query = search.trim().toLowerCase();
  const isSearching = query.length > 0;

  const letterCounts = useMemo(() => {
    const counts = Object.fromEntries(alphabet.map((letter) => [letter, 0]));

    brands.forEach((brand) => {
      const firstLetter = (brand.brand_name || "").trim().charAt(0).toUpperCase();

      if (counts[firstLetter] !== undefined) {
        counts[firstLetter] += 1;
      }
    });

    return counts;
  }, [brands]);

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const name = (brand.brand_name || "").trim();
      const lowerName = name.toLowerCase();

      // Search always runs across ALL brands. It must not be trapped inside
      // the previously selected alphabet letter.
      if (isSearching) {
        return lowerName.includes(query);
      }

      if (selectedLetter === "ALL") {
        return true;
      }

      return name.toUpperCase().startsWith(selectedLetter);
    });
  }, [brands, isSearching, query, selectedLetter]);

  const suggestions = useMemo(() => {
    if (query.length < 2) return [];

    return brands
      .filter((brand) =>
        (brand.brand_name || "").toLowerCase().includes(query)
      )
      .sort((a, b) => {
        const aName = (a.brand_name || "").toLowerCase();
        const bName = (b.brand_name || "").toLowerCase();
        const aStarts = aName.startsWith(query);
        const bStarts = bName.startsWith(query);

        if (aStarts !== bStarts) return aStarts ? -1 : 1;
        return aName.localeCompare(bName);
      })
      .slice(0, 8);
  }, [brands, query]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredBrands.length / brandsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const displayedBrands = filteredBrands.slice(
    (currentPage - 1) * brandsPerPage,
    currentPage * brandsPerPage
  );

  const pageItems = buildPagination(currentPage, totalPages);
  const rangeStart =
    filteredBrands.length === 0
      ? 0
      : (currentPage - 1) * brandsPerPage + 1;
  const rangeEnd = Math.min(
    currentPage * brandsPerPage,
    filteredBrands.length
  );

  const chooseLetter = (letter) => {
    setSelectedLetter(letter);
    setSearch("");
    setCurrentPage(1);
    setSuggestionsOpen(false);
    setActiveSuggestion(-1);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);
    setCurrentPage(1);
    setActiveSuggestion(-1);

    // Searching is global, so visually return the alphabet filter to ALL.
    if (value.trim()) {
      setSelectedLetter("ALL");
    }

    setSuggestionsOpen(value.trim().length >= 2);
  };

  const applySuggestion = (brand) => {
    setSearch(brand.brand_name || "");
    setSelectedLetter("ALL");
    setCurrentPage(1);
    setSuggestionsOpen(false);
    setActiveSuggestion(-1);
  };

  const clearSearch = () => {
    setSearch("");
    setSelectedLetter("ALL");
    setCurrentPage(1);
    setSuggestionsOpen(false);
    setActiveSuggestion(-1);
  };

  const handleSearchKeyDown = (event) => {
    if (!suggestionsOpen || suggestions.length === 0) {
      if (event.key === "Escape") {
        setSuggestionsOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestion((current) =>
        current < suggestions.length - 1 ? current + 1 : 0
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestion((current) =>
        current > 0 ? current - 1 : suggestions.length - 1
      );
    }

    if (event.key === "Enter" && activeSuggestion >= 0) {
      event.preventDefault();
      applySuggestion(suggestions[activeSuggestion]);
    }

    if (event.key === "Escape") {
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
    }
  };

  return (
    <main className="brands-directory-page">
      <section className="brands-directory-shell">
        <header className="brands-directory-hero">
          <span className="brands-directory-hero__eyebrow">
            NAVSA BRAND DIRECTORY
          </span>
          <h1>Brands</h1>
        </header>

        <section
          className="brands-directory-search-panel"
          aria-label="Search and filter brands"
        >
          <div className="brands-directory-search-row">
            <div className="brands-directory-hero__count">
              <strong>{brands.length.toLocaleString()}</strong>
              <span>active brands</span>
            </div>

            <div className="brands-directory-search" ref={searchWrapRef}>
            <Search size={19} aria-hidden="true" />

            <input
              type="search"
              value={search}
              placeholder="Search brands..."
              aria-label="Search brands"
              aria-autocomplete="list"
              aria-expanded={suggestionsOpen && suggestions.length > 0}
              onChange={handleSearchChange}
              onFocus={() => {
                if (query.length >= 2) setSuggestionsOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
            />

            {search && (
              <button
                type="button"
                className="brands-directory-search__clear"
                onClick={clearSearch}
                aria-label="Clear brand search"
              >
                <X size={17} />
              </button>
            )}

            {suggestionsOpen && query.length >= 2 && (
              <div
                className="brands-directory-suggestions"
                role="listbox"
                aria-label="Brand suggestions"
              >
                {suggestions.length > 0 ? (
                  suggestions.map((brand, index) => (
                    <button
                      key={brand.id}
                      type="button"
                      role="option"
                      aria-selected={activeSuggestion === index}
                      className={
                        activeSuggestion === index
                          ? "brands-directory-suggestion is-active"
                          : "brands-directory-suggestion"
                      }
                      onMouseDown={(event) => {
                        event.preventDefault();
                        applySuggestion(brand);
                      }}
                    >
                      <span className="brands-directory-suggestion__mark">
                        {brand.brand_name?.charAt(0)?.toUpperCase() || "?"}
                      </span>
                      <span>{brand.brand_name}</span>
                    </button>
                  ))
                ) : (
                  <div className="brands-directory-suggestions__empty">
                    No matching brand suggestions
                  </div>
                )}
              </div>
            )}
            </div>
          </div>

          <div className="brands-directory-alphabet" aria-label="Filter brands by letter">
            <button
              type="button"
              className={
                selectedLetter === "ALL" && !isSearching
                  ? "brands-directory-letter is-active"
                  : "brands-directory-letter"
              }
              onClick={() => chooseLetter("ALL")}
            >
              ALL
            </button>

            {alphabet.map((letter) => {
              const count = letterCounts[letter] || 0;

              return (
                <button
                  key={letter}
                  type="button"
                  title={`${count} brand${count === 1 ? "" : "s"} beginning with ${letter}`}
                  disabled={count === 0}
                  className={
                    selectedLetter === letter && !isSearching
                      ? "brands-directory-letter is-active"
                      : "brands-directory-letter"
                  }
                  onClick={() => chooseLetter(letter)}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        </section>

        <div className="brands-directory-results-head">
          <div>
            <strong>
              {isSearching
                ? `Search results for “${search.trim()}”`
                : selectedLetter === "ALL"
                  ? "All brands"
                  : `Brands beginning with ${selectedLetter}`}
            </strong>
          </div>

          {!loading && filteredBrands.length > 0 && (
            <span className="brands-directory-results-head__range">
              Showing {rangeStart.toLocaleString()}–{rangeEnd.toLocaleString()} of{" "}
              {filteredBrands.length.toLocaleString()}
            </span>
          )}
        </div>

        {loading ? (
          <div className="brands-directory-state">
            <span className="brands-directory-spinner" aria-hidden="true" />
            <strong>Loading brands</strong>
            <p>Please wait while the brand directory is prepared.</p>
          </div>
        ) : loadError ? (
          <div className="brands-directory-state brands-directory-state--error">
            <strong>Brand directory could not be loaded</strong>
            <p>{loadError}</p>
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="brands-directory-state">
            <Search size={28} aria-hidden="true" />
            <strong>No brands found</strong>
            <p>
              {search.trim()
                ? `No brand matches “${search.trim()}”. Try another spelling or clear the search.`
                : "There are no brands available for this filter."}
            </p>
            {search.trim() && (
              <button type="button" onClick={clearSearch}>
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="brands-directory-grid">
              {displayedBrands.map((brand) => (
                <Link
                  key={brand.id}
                  to={`/shop?brand=${encodeURIComponent(brand.brand_name)}`}
                  className="brands-directory-card"
                  title={`Shop ${brand.brand_name}`}
                >
                  <div className="brands-directory-card__visual">
                    <BrandLogo brandName={brand.brand_name} />
                  </div>

                  <div className="brands-directory-card__name">
                    {brand.brand_name}
                  </div>
                </Link>
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                className="brands-directory-pagination"
                aria-label="Brand directory pages"
              >
                <button
                  type="button"
                  className="brands-directory-pagination__nav"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((page) => Math.max(1, page - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="brands-directory-pagination__pages">
                  {pageItems.map((item) =>
                    typeof item === "number" ? (
                      <button
                        key={item}
                        type="button"
                        aria-current={currentPage === item ? "page" : undefined}
                        className={
                          currentPage === item
                            ? "brands-directory-page-number is-active"
                            : "brands-directory-page-number"
                        }
                        onClick={() => {
                          setCurrentPage(item);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {item}
                      </button>
                    ) : (
                      <span key={item} className="brands-directory-pagination__ellipsis">
                        …
                      </span>
                    )
                  )}
                </div>

                <button
                  type="button"
                  className="brands-directory-pagination__nav"
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    );
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}