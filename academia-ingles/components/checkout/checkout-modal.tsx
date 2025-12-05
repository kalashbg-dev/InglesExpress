'use client';

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentForm } from "./payment-form";
import { OrderSummary } from "./order-summary";
import { CreditCard, Banknote, Wallet, Lock } from "lucide-react";

interface CheckoutModalProps {
  children?: React.ReactNode;
}

export function CheckoutModal({ children }: CheckoutModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="grid md:grid-cols-12">

          {/* Main Content (Payment Methods & Form) */}
          <div className="md:col-span-8 p-6 md:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">Finalizar Inscripción</DialogTitle>
              <DialogDescription>
                Completa tus datos para asegurar tu cupo en el nivel seleccionado.
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="card" className="w-full">
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">Selecciona método de pago:</p>
                <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-gray-100">
                  <TabsTrigger value="card" className="py-3 flex flex-col gap-1 items-center data-[state=active]:shadow-sm">
                    <CreditCard className="h-5 w-5" />
                    <span>Tarjeta</span>
                  </TabsTrigger>
                  <TabsTrigger value="transfer" className="py-3 flex flex-col gap-1 items-center">
                    <Banknote className="h-5 w-5" />
                    <span>Transferencia</span>
                  </TabsTrigger>
                  <TabsTrigger value="paypal" className="py-3 flex flex-col gap-1 items-center">
                    <Wallet className="h-5 w-5" />
                    <span>PayPal</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="card" className="mt-0 animate-in fade-in-50">
                <div className="flex gap-2 mb-6">
                   {['visa', 'mastercard', 'amex'].map(brand => (
                     <div key={brand} className="h-8 w-12 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                       {brand}
                     </div>
                   ))}
                   <div className="ml-auto flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 rounded-full border border-green-100">
                     <Lock className="h-3 w-3" />
                     Pago Seguro
                   </div>
                </div>
                <PaymentForm />
              </TabsContent>

              <TabsContent value="transfer" className="mt-0 p-4 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <p className="text-gray-600 mb-4">Realiza tu transferencia a la siguiente cuenta:</p>
                <div className="bg-white p-4 rounded border border-gray-200 mb-4 text-left">
                  <p className="text-sm text-gray-500">Banco Popular</p>
                  <p className="font-mono font-bold text-lg">789-456-123-0</p>
                  <p className="text-sm text-gray-500">A nombre de: Academia de Inglés SRL</p>
                </div>
                <p className="text-xs text-gray-500">
                  Una vez realizada, envía el comprobante a pagos@academiaingles.com
                </p>
              </TabsContent>

              <TabsContent value="paypal" className="mt-0 p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
                <p className="mb-4 text-gray-600">Serás redirigido a PayPal para completar tu pago de forma segura.</p>
                <div className="w-full max-w-xs mx-auto h-12 bg-[#0070BA] rounded text-white flex items-center justify-center font-bold cursor-pointer hover:bg-[#005ea6] transition-colors">
                  Pagar con PayPal
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-4 bg-gray-50/50 p-6 md:p-8 border-l border-gray-100">
             <OrderSummary />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
