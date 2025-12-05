// src/components/PlanCard.tsx
import type { EsimPlan } from "@/types/esim";

interface PlanCardProps {
  plan: EsimPlan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const isUnlimited = plan.dataUnit === "ILIMITADO";

  return (
    <div className="rounded-2xl border border-slate-700 p-4 flex flex-col hover:border-emerald-400 transition">
      {plan.isPopular && (
        <span className="inline-flex items-center rounded-full bg-emerald-500/10 text-emerald-300 text-[11px] font-semibold px-2 py-0.5 self-start mb-2">
          Más elegido
        </span>
      )}

      <h3 className="font-semibold text-base">{plan.name}</h3>

      <div className="mt-3 flex items-baseline gap-2 text-sm text-slate-300">
        <span className="font-medium">
          {isUnlimited ? "Datos ilimitados" : `${plan.dataAmount} ${plan.dataUnit}`}
        </span>
        <span className="text-slate-500">·</span>
        <span className="text-slate-400">{plan.validityDays} días</span>
      </div>

      {plan.description && (
        <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
      )}

      {plan.recommendedFor && (
        <p className="mt-1 text-xs text-emerald-300">
          Recomendado para: {plan.recommendedFor}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400">Precio estimado</p>
          <p className="text-lg font-semibold">
            USD {plan.priceUSD.toFixed(0)}
          </p>
          <p className="text-[11px] text-slate-500">
            Referencial · después conectamos precios reales
          </p>
        </div>

        <button
          className="rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-black hover:bg-emerald-400 transition"
          type="button"
        >
          Elegir plan
        </button>
      </div>
    </div>
  );
}
