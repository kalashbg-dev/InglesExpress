'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Lock } from "lucide-react";

// Mock validation schema
const paymentSchema = z.object({
  cardName: z.string().min(3, "El nombre es requerido"),
  cardNumber: z.string().min(16, "Número de tarjeta inválido"),
  expiryDate: z.string().min(5, "Fecha inválida (MM/YY)"),
  cvc: z.string().min(3, "CVC inválido"),
  saveCard: z.boolean().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

export function PaymentForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormData) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log("Processing payment:", data);
    alert("Pago procesado con éxito (Simulación)");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardName">Nombre en la tarjeta</Label>
          <Input
            id="cardName"
            placeholder="Como aparece en la tarjeta"
            {...register("cardName")}
            className={errors.cardName ? "border-red-500" : ""}
          />
          {errors.cardName && <p className="text-xs text-red-500">{errors.cardName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cardNumber">Número de tarjeta</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="cardNumber"
              placeholder="0000 0000 0000 0000"
              className={`pl-10 ${errors.cardNumber ? "border-red-500" : ""}`}
              {...register("cardNumber")}
            />
          </div>
          {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Fecha de Expiración</Label>
            <Input
              id="expiryDate"
              placeholder="MM/YY"
              {...register("expiryDate")}
              className={errors.expiryDate ? "border-red-500" : ""}
            />
            {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvc">CVC / CWW</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="cvc"
                placeholder="123"
                className={`pl-10 ${errors.cvc ? "border-red-500" : ""}`}
                {...register("cvc")}
              />
            </div>
            {errors.cvc && <p className="text-xs text-red-500">{errors.cvc.message}</p>}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox id="saveCard" {...register("saveCard")} />
          <Label htmlFor="saveCard" className="font-normal text-sm text-gray-600">
            Guardar tarjeta para futuros pagos
          </Label>
        </div>
      </div>

      <Button type="submit" className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90" disabled={isSubmitting}>
        {isSubmitting ? "Procesando..." : "Pagar RD$ 2,500"}
      </Button>

      <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
        <Lock className="h-3 w-3" />
        Pagos seguros encriptados con SSL de 256-bit
      </p>
    </form>
  );
}
