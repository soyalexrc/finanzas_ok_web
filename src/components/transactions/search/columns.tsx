"use client"

import {ColumnDef} from "@tanstack/react-table"
import {TransactionsByUserResponse} from "@/lib/types/transaction";
import {format} from "date-fns";
import {TrendingUp, TrendingDown, Eye, Pencil, Trash2, ArrowUpDown} from "lucide-react";

import {MoreHorizontal} from "lucide-react"

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {es} from "date-fns/locale";
import {useRouter} from "next/navigation";
import {shortString} from "@/lib/helpers/string";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

export const columns: ColumnDef<TransactionsByUserResponse>[] = [
    {
        accessorKey: "title",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Titulo
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        }
    },
    {
        accessorKey: "description",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Descripcion
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({ row }) => {
            const description: any = row.getValue("description");
            return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                {shortString(description, 16)}
                            </TooltipTrigger>
                            <TooltipContent>
                                {description}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

            )
        }
    },
    {
        accessorKey: "date",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fecha
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const date: any = row.getValue("date");
            return (
                <div className="w-[180px]">
                    {format(new Date(date), "dd/MM/yyyy hh:mm:ss a", {locale: es})}
                </div>
            )
        }
    },
    {
        accessorKey: "category.title",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Categoria
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const transaction: any = row.original;
            return (
                <div className="flex items-center gap-2">
                    <span className="text-lg">{transaction.category?.icon}</span>
                    {transaction.category?.title}
                </div>
            )
        }
    },
    {
        accessorKey: "currency.code",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Moneda
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const transaction: any = row.original;
            return (
                <div className="flex items-center gap-2">
                    <span className="text-sm">{transaction.currency?.code}</span>
                </div>
            )
        }
    },
    {
        accessorKey: "amount",
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Monto
                    <ArrowUpDown className="ml-2 h-4 w-4"/>
                </Button>
            )
        },
        cell: ({row}) => {
            const fullRow = row.original;
            console.log(fullRow);

            return (
                <div className="flex items-center gap-2">
                    <p>{fullRow.currency.symbol} {fullRow.amount}</p>
                    {
                        fullRow.category.type === 'income' ? (
                            <TrendingUp size={14} className="text-green-500"/>
                        ) : (
                            <TrendingDown size={14} className="text-red-500"/>
                        )
                    }
                </div>
            )
        }
    },
    {
        id: "actions",
        cell: ({row}) => {
            const transaction = row.original

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const router = useRouter()

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => router.push(`/dashboard/search/${transaction._id}`)}>
                            <Pencil className="text-blue-500"/>
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                            <Eye/>
                            Ver evidencias
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Trash2 className="text-red-500"/>
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
