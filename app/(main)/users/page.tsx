"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Plus, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UserModal } from "@/components/user/user-modal";
import { toast } from "sonner";

interface User {
  userID: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
}

interface PaginationMeta {
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can make this adjustable if needed
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    totalItems: 0,
    itemsPerPage: itemsPerPage,
    totalPages: 1,
    currentPage: 1,
  });

  // Fetch users data
  const fetchUsers = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/users?page=${page}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();

        // If your API returns paginated data in a specific format, adjust accordingly
        // This assumes the API returns { data: Room[], meta: PaginationMeta }
        if (data.meta && data.meta) {
          setUsers(data.data);
          setPaginationMeta(data.meta);
        } else {
          setUsers(data.data);

          const totalItems = data.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);

          const startIndex = (page - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          const paginatedData = data.slince(startIndex, endIndex);

          setUsers(paginatedData);
          setPaginationMeta({
            totalItems,
            itemsPerPage,
            totalPages,
            currentPage: page,
          });
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setIsLoading(false);
      }
    },
    [itemsPerPage]
  );

  // Load users data on component mount
  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > paginationMeta.totalPages) return;
    setCurrentPage(page);
  };

  // Open modal for adding a new user
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close the modal and refresh data
  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchUsers(); // Refresh the data after modal closes
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.middleName &&
        user.middleName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.isAdmin && user.isAdmin.toString().includes(searchTerm)) ||
      (user.isActive && user.isActive.toString().includes(searchTerm))
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { totalPages, currentPage } = paginationMeta;
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Show ellipsis if needed
    if (currentPage > 3) {
      pageNumbers.push("ellipsis1");
    }

    // Show current page and surrounding pages
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i !== 1 && i !== totalPages) {
        pageNumbers.push(i);
      }
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      pageNumbers.push("ellipsis2");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="py-8">
      <div className="mb-8 flex flex-col lg:flex-row items-center justify-between">
        <h1 className="text-[32px] leading-5 font-semibold text-masala-900 pb-8 lg:pb-0">
          User Management
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-2 h-5 w-5 text-rock-blue-500" />
            <Input
              placeholder="Search users..."
              className="w-[230px] pl-10 pr-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={handleAddUser} className="gap-2">
            <Plus className="h-5 w-5" />
            Add User
          </Button>
        </div>
      </div>

      <div className="h-auto rounded-lg border bg-zircon-50/60">
        {isLoading ? (
          <div className="flex justify-center py-8">Loading users...</div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                {searchTerm
                  ? "No matching users found."
                  : "No users found. Add your first user."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Role</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.userID}>
                      <TableCell>
                        {user.firstName}{" "}
                        {user.middleName ? user.middleName + " " : ""}
                        {user.lastName}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            user.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {user.isAdmin ? "Admin" : "User"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditUser(user)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </div>

      {paginationMeta.totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => {
              if (page === "ellipsis1" || page === "ellipsis2") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={`page-${page}`}>
                  <PaginationLink
                    onClick={() => handlePageChange(page as number)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className={
                  currentPage === paginationMeta.totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
}
