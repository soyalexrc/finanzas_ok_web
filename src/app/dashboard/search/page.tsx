'use client';

import {useTransactionsGroupedByDay} from "@/lib/helpers/api/transactions/queries";
import {getCustomMonthRange} from "@/lib/helpers/date";
// import {useState} from "react";
import {useAuth} from "@/lib/context/AuthContext";
import {columns} from "@/components/transactions/search/columns";
import {DataTable} from "@/components/transactions/search/data-table";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Screen() {
    // const [dateFrom, setDateFrom] = useState<string>(getCustomMonthRange(2, 2).start.toISOString());
    // const [dateTo, setDateTo] = useState<string>(getCustomMonthRange(2, 2).end.toISOString());
    const { user, token } = useAuth();
    const {data: transactions, isLoading} = useTransactionsGroupedByDay(user?._id, getCustomMonthRange(2, 5).start.toISOString(), getCustomMonthRange(2, 5).end.toISOString(), '', token);

    return (
        <div className="flex flex-col p-4  h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Buscar</h1>
               <Link href="/dashboard/search/new">
                   <Button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                       Nueva transaccion
                   </Button>
               </Link>
            </div>

           <Card className="bg-white shadow-md rounded-lg">
               <CardContent>
                   {
                       isLoading ? (
                           <div className="flex items-center justify-center h-full py-10">
                               <div className="w-full max-w-4xl">
                                   <div className="animate-pulse space-y-4">
                                       {[...Array(5)].map((_, index) => (
                                           <div key={index} className="h-6 bg-gray-300 rounded"></div>
                                       ))}
                                   </div>
                               </div>
                           </div>
                       ) : (
                           <div className="flex flex-col mt-4">
                               <DataTable
                                   columns={columns}
                                   data={transactions ?? []}
                               />
                           </div>
                       )
                   }
               </CardContent>
           </Card>

        </div>
    );
}
