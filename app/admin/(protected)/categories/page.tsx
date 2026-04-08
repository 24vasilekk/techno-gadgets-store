export default function AdminCategoriesPage(): JSX.Element {
  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl">Категории</h2>
      <p className="text-sm text-muted-foreground">
        Управление деревом категорий, slug-ами и описаниями разделов для каталога и SEO.
      </p>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-sm text-muted-foreground">План: drag-and-drop структура, статус публикации, быстрый предпросмотр.</p>
      </div>
    </div>
  );
}
