"use client";

import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import tailwindConfig from "@/tailwind.config";
import resolveConfig from "tailwindcss/resolveConfig";
import useGetAllMovies from "@/hooks/custom/useGetAllMovies";

const tailwind = resolveConfig(tailwindConfig);

export const exampleStatuses = [
  { id: "1", name: "Planned", color: tailwind.theme.colors.gray[500] },
  { id: "2", name: "In Progress", color: tailwind.theme.colors.amber[500] },
  { id: "3", name: "Done", color: tailwind.theme.colors.emerald[500] },
];

export default function MoviesTable({ ImageBase }: { ImageBase: string }) {
  const hits = useGetAllMovies(ImageBase); // Use result from API call
  console.log(hits)
  const movies = hits.map((movie: { id: number; title: string; photo?: string; duration: number; language: string; ageLimit: number; director: string; synopsis: string; }) => ({
    id: movie.id,
    name: movie.title,
    image: movie.photo ? `${ImageBase}/${movie.photo}` : null,
    duration: movie.duration,
    language: movie.language,
    ageLimit: movie.ageLimit,
    director: movie.director,
    synopsis: movie.synopsis,
  }));

  const columns: ColumnDef<typeof movies[number]>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="relative">
            <Image
              src={row.original.image!}
              alt={row.original.name}
              width={24}
              height={24}
              unoptimized
              className="h-6 w-6 rounded-full"
            />
          </div>
          <div>
            <span className="font-medium">{row.original.name}</span>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <span>{row.original.duration} min</span>
              <ChevronRightIcon size={12} />
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Duration" />
      ),
      cell: ({ row }) => `${row.original.duration} min`,
    },
    {
      accessorKey: "director",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Director" />
      ),
      cell: ({ row }) => row.original.director,
    },
    {
      accessorKey: "synopsis",
      header: ({ column }) => (
        <TableColumnHeader column={column} title="Synopsis" />
      ),
      cell: ({ row }) => (
        <div className="text-muted-foreground text-xs">{row.original.synopsis}</div>
      ),
    },
  ];

  return (
    <div className="overflow-scroll rounded-xl border-2">
      <TableProvider
        columns={columns}
        data={movies}
        className="border rounded-lg"
      >
        <TableHeader>
          {({ headerGroup }) => (
            <TableHeaderGroup key={headerGroup.id} headerGroup={headerGroup}>
              {({ header }) => <TableHead key={header.id} header={header} />}
            </TableHeaderGroup>
          )}
        </TableHeader>
        <TableBody>
          {({ row }) => (
            <TableRow key={row.id} row={row}>
              {({ cell }) => <TableCell key={cell.id} cell={cell} />}
            </TableRow>
          )}
        </TableBody>
      </TableProvider>
    </div>
  );
};
