import { adminDashboardStats, adminRecentOrders, adminSections } from '@/data/admin/mock';

export default function AdminDashboardPage(): JSX.Element {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="font-heading text-2xl">Обзор магазина</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ключевые метрики и зоны управления за текущий день.</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {adminDashboardStats.map((stat) => (
          <article key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-heading text-2xl">{stat.value}</p>
            <p className="mt-2 text-xs text-muted-foreground">{stat.note}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.05fr,0.95fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="font-heading text-xl">Последние заявки</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="px-2 py-2 font-medium">ID</th>
                  <th className="px-2 py-2 font-medium">Клиент</th>
                  <th className="px-2 py-2 font-medium">Сумма</th>
                  <th className="px-2 py-2 font-medium">Статус</th>
                  <th className="px-2 py-2 font-medium">Время</th>
                </tr>
              </thead>
              <tbody>
                {adminRecentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-white/10">
                    <td className="px-2 py-2">{order.id}</td>
                    <td className="px-2 py-2">{order.customer}</td>
                    <td className="px-2 py-2">{order.total}</td>
                    <td className="px-2 py-2">{order.status}</td>
                    <td className="px-2 py-2 text-muted-foreground">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <h3 className="font-heading text-xl">Зоны управления</h3>
          <div className="mt-3 space-y-2">
            {adminSections.map((section) => (
              <article key={section.title} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <p className="font-medium">{section.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
