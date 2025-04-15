'use client';
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Card, CardTitle} from "@/components/ui/card";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {CalendarIcon, Star} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {es} from "date-fns/locale";
import {ScrollArea} from "@/components/ui/scroll-area";
import MoneyInput from "@/components/ui/money-input";
import useCurrencyStore from "@/lib/store/currency-store";
import {useEffect, useState} from "react";
import {CurrencyV2} from "@/lib/types/currency";
import {useAuth} from "@/lib/context/AuthContext";
import {Textarea} from "@/components/ui/textarea";

type CurrencyData = {
    code: string;
    decimals: number;
};


const formSchema = z.object({
    title: z.string().min(1, {message: "Title is required"}),
    description: z.string().optional(),
    category: z.string().min(1, {message: "Category is required"}),
    documents: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    amount: z.coerce.number().min(0.01, "Required"),
    date: z.date({required_error: "Date is required"}),
    currency: z.string().min(1, {message: "Currency is required"}),
});

export default function Page() {
    const {currencies, selectedCurrency} = useCurrencyStore((state) => state);
    const {user} = useAuth();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            category: "",
            documents: [],
            images: [],
            amount: 0,
            date: new Date(),
            currency: "",
        },
    });
    const [fullSelectedCurrency, setFullSelectedCurrency] = useState<CurrencyV2>(selectedCurrency);
    const [formatters, setFormatters] = useState<Record<string, Intl.NumberFormat>>({});


    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log(values);
    };

    const watchedCurrency = form.watch('currency');



    useEffect(() => {
        if (currencies && currencies.length > 0) {
            initCurrencyFormatters(currencies.map(c => ({code: c.code, decimals: c.decimals})));
        }
    }, [currencies]);

    useEffect(() => {
        const newCurrency = currencies?.find(c => c._id === watchedCurrency);
        setFullSelectedCurrency(newCurrency!);
        form.setValue('amount', 0, { shouldTouch: true });
    }, [watchedCurrency]);


    const initCurrencyFormatters = (cs: CurrencyData[]) => {
        const newFormatters: Record<string, Intl.NumberFormat> = {};
        cs.forEach((currency) => {
            newFormatters[currency.code] = new Intl.NumberFormat("es-PE", {
                style: "currency",
                currency: currency.code,
                currencyDisplay: "symbol",
                currencySign: "standard",
                minimumFractionDigits: currency.decimals,
                maximumFractionDigits: currency.decimals,
            });
        });
        setFormatters(newFormatters);
    };

    const getCurrencyFormatter = (code: string): Intl.NumberFormat => {
        const formatter = formatters[code];
        if (!formatter) {
            console.warn(`No formatter for "${code}"`);
        }
        return formatter;
    };

    // const formatCurrency = (code: string, value: number): string => {
    //     return getCurrencyFormatter(code).format(value);
    // };


    function isFavCurrency(currency: CurrencyV2) {
        return user?.favCurrencies?.includes(currency._id);
    }


    return (
        <div className="flex flex-col p-4 h-screen">
            <div className="grid grid-cols-3 gap-4">
                <Card className="col-span-2 p-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Título</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Título de la transacción" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Descripción adicional" {...field} ></Textarea>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Categoría</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una categoría"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="food">Comida</SelectItem>
                                                    <SelectItem value="transport">Transporte</SelectItem>
                                                    <SelectItem value="utilities">Servicios</SelectItem>
                                                    <SelectItem value="other">Otros</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Moneda</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una moneda"/>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {
                                                        currencies?.map(c => (
                                                            <SelectItem key={c._id} value={c._id}>
                                                               <div className="flex items-center gap-2">
                                                                   {
                                                                       isFavCurrency(c) &&
                                                                       <Star className="text-yellow-600 fill-yellow-500 w-[10px] height-[10px]" size={10} />
                                                                   }
                                                                   {c.code} ({c.name})
                                                               </div>
                                                            </SelectItem>
                                                        ))
                                                    }
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            {
                                Object.keys(formatters)?.length > 0 &&
                                <MoneyInput
                                    form={form}
                                    label="Monto"
                                    name="amount"
                                    placeholder="Monto"
                                    formatter={getCurrencyFormatter(fullSelectedCurrency?.code)}
                                />
                            }

                            {/*<FormField*/}
                            {/*    control={form.control}*/}
                            {/*    name="amount"*/}
                            {/*    render={({field}) => (*/}
                            {/*        <FormItem>*/}
                            {/*            <FormLabel>Monto</FormLabel>*/}
                            {/*            <FormControl>*/}
                            {/*                <Input type="number" placeholder="0.00" {...field}*/}
                            {/*                       onChange={(e) => field.onChange(Number(e.target.value))}/>*/}
                            {/*            </FormControl>*/}
                            {/*            <FormMessage/>*/}
                            {/*        </FormItem>*/}
                            {/*    )}*/}
                            {/*/>*/}

                            <FormField
                                control={form.control}
                                name="date"
                                render={({field}) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4"/>
                                                    {field.value ? format(field.value, "PPP", {locale: es}) :
                                                        <span>Selecciona una fecha</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    locale={es}
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />


                            <div className="flex justify-end">
                                <Button type="submit" className="w-full md:w-auto">Guardar</Button>
                            </div>
                        </form>
                    </Form>
                </Card>
                <Card className="p-4">
                    <CardTitle className="mb-4">Evidencias</CardTitle>

                    <ScrollArea className="h-[560px]">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Upload Box */}
                            <label
                                htmlFor="evidence-upload"
                                className="flex items-center justify-center border-2 border-dashed border-muted-foreground rounded-xl cursor-pointer p-4 text-center hover:bg-muted transition"
                            >
                                <div>
                                    <p className="text-sm text-muted-foreground">Haz clic o arrastra archivos</p>
                                    <p className="text-xs">Imágenes o documentos</p>
                                </div>
                                <input
                                    id="evidence-upload"
                                    type="file"
                                    multiple
                                    className="hidden"
                                    accept="image/*,.pdf,.doc,.docx"
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files || []);
                                        // TODO: handle file upload (store in state or form)
                                        console.log(files);
                                    }}
                                />
                            </label>

                            {/* Static Previews - Replace these with actual files */}
                            <div
                                className="flex flex-col items-center text-center text-sm border rounded-xl p-2 overflow-hidden">
                                <img
                                    src="https://via.placeholder.com/100"
                                    alt="Preview"
                                    className="w-full h-24 object-cover rounded-md"
                                />
                                <p className="mt-1 truncate w-full">imagen1.jpg</p>
                            </div>
                            <div
                                className="flex flex-col items-center text-center text-sm border rounded-xl p-2 overflow-hidden">
                                  <span
                                      className="w-full h-24 flex items-center justify-center bg-muted text-muted-foreground rounded-md">
                                    📄 PDF
                                  </span>
                                <p className="mt-1 truncate w-full">documento.pdf</p>
                            </div>

                            {/* Repeat previews dynamically if needed */}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    );
}
