export function OrderSummary() {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-full">
      <h3 className="font-semibold text-gray-900 mb-4">Resumen de Compra</h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-start pb-4 border-b border-gray-200">
          <div>
            <p className="font-medium text-gray-900">Nivel A1 - Principiante</p>
            <p className="text-sm text-gray-500">Duración: 4 Meses</p>
          </div>
          <p className="font-medium text-gray-900">RD$ 2,500</p>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>Matrícula</p>
          <p className="text-green-600 font-medium">GRATIS</p>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-600">
          <p>Material Digital</p>
          <p className="text-green-600 font-medium">INCLUIDO</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
        <p className="text-lg font-bold text-gray-900">Total a Pagar</p>
        <p className="text-xl font-bold text-primary">RD$ 2,500</p>
      </div>

      <div className="bg-blue-50 p-3 rounded text-xs text-blue-700 leading-tight">
        <p className="font-semibold mb-1">Garantía de Reembolso</p>
        <p>Si no estás satisfecho en la primera semana, te devolvemos el 100% de tu dinero.</p>
      </div>
    </div>
  );
}
