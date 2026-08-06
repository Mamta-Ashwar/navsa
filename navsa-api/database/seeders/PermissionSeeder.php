<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // List of all permissions by module
        $permissionsByModule = [
            'products' => [
                'products.view',
                'products.create',
                'products.edit',
                'products.delete',
                'products.import-erp',
            ],
            'offers' => [
                'offers.view',
                'offers.manage',
            ],
            'registrations' => [
                'registrations.view',
                'registrations.approve',
                'registrations.reject',
            ],
            'customers' => [
                'customers.view',
                'customers.manage',
            ],
            'suppliers' => [
                'suppliers.view',
                'suppliers.manage',
            ],
            'brands' => [
                'brands.manage',
            ],
            'categories' => [
                'categories.manage',
            ],
            'content' => [
                'banners.manage',
                'pdfs.manage',
            ],
            'roles' => [
                'roles.view',
                'roles.manage',
            ],
            'orders' => [
                'orders.view',
                'orders.manage',
            ],
        ];

        // Create all permissions
        foreach ($permissionsByModule as $module => $permissions) {
            foreach ($permissions as $permissionName) {
                Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'sanctum']);
                Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
            }
        }

        // Create Roles & Sync Permissions for both sanctum and web guards
        foreach (['sanctum', 'web'] as $guard) {
            $superAdminRole = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => $guard]);
            $catalogAdminRole = Role::firstOrCreate(['name' => 'catalog-admin', 'guard_name' => $guard]);
            $productManagerRole = Role::firstOrCreate(['name' => 'product-manager', 'guard_name' => $guard]);
            $userManagerRole = Role::firstOrCreate(['name' => 'user-manager', 'guard_name' => $guard]);
            $contentManagerRole = Role::firstOrCreate(['name' => 'content-manager', 'guard_name' => $guard]);
            $salesRole = Role::firstOrCreate(['name' => 'sales', 'guard_name' => $guard]);
            $purchasingRole = Role::firstOrCreate(['name' => 'purchasing', 'guard_name' => $guard]);
            $customerRole = Role::firstOrCreate(['name' => 'customer', 'guard_name' => $guard]);
            $supplierRole = Role::firstOrCreate(['name' => 'supplier', 'guard_name' => $guard]);

            // Give all permissions to Super Admin
            $allPermissions = Permission::where('guard_name', $guard)->get();
            $superAdminRole->syncPermissions($allPermissions);

            // Catalog Admin permissions
            $catalogPermissions = Permission::where('guard_name', $guard)
                ->where(function ($q) {
                    $q->where('name', 'like', 'products.%')
                      ->orWhere('name', 'like', 'offers.%')
                      ->orWhere('name', 'like', 'brands.%')
                      ->orWhere('name', 'like', 'categories.%')
                      ->orWhere('name', 'like', 'banners.%')
                      ->orWhere('name', 'like', 'pdfs.%');
                })->get();
            $catalogAdminRole->syncPermissions($catalogPermissions);

            // Sales permissions
            $salesPermissions = Permission::where('guard_name', $guard)
                ->where('name', 'like', 'orders.%')
                ->get();
            $salesRole->syncPermissions($salesPermissions);
        }

        // Users specified in Admin Details.docx
        $adminUsersData = [
            [
                'name' => 'Director',
                'email' => 'info@navsainternational.com',
                'password' => 'Info@123',
                'role_name' => 'super-admin',
            ],
            [
                'name' => 'Accounts Department',
                'email' => 'accounts@navsainternational.com',
                'password' => 'Accounts@123',
                'role_name' => 'super-admin',
            ],
            [
                'name' => 'Web Administrator',
                'email' => 'webmaster@navsainternational.com',
                'password' => 'Web@123',
                'role_name' => 'super-admin',
            ],
            [
                'name' => 'Product Manager',
                'email' => 'product@navsainternational.com',
                'password' => 'Product@123',
                'role_name' => 'super-admin',
            ],
            [
                'name' => 'Admin User',
                'email' => 'admin@navsainternational.com',
                'password' => 'Admin@123',
                'role_name' => 'catalog-admin',
            ],
            [
                'name' => 'Sales Admin',
                'email' => 'sales@navsainternational.com',
                'password' => 'Sales@123',
                'role_name' => 'sales',
            ],
            [
                'name' => 'Purchasing Admin',
                'email' => 'purchasing@navsainternational.com',
                'password' => 'Purchasing@123',
                'role_name' => 'purchasing',
            ],
            [
                'name' => 'Navsa Super Admin',
                'email' => 'admin@navsa.com',
                'password' => 'navsa2024',
                'role_name' => 'super-admin',
            ],
        ];

        foreach ($adminUsersData as $userData) {
            $user = User::updateOrCreate(
                ['email' => $userData['email']],
                [
                    'name' => $userData['name'],
                    'password' => Hash::make($userData['password']),
                    'role' => 'admin',
                    'status' => 'approved',
                    'approved_at' => now(),
                ]
            );

            // Sync spatie role
            $user->syncRoles([$userData['role_name']]);
        }
    }
}

