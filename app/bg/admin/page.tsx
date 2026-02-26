export default function AdminPage() {
  return (
    <main style={{ padding: 40 }}>
      <h1>Admin Panel</h1>

      <ul style={{ marginTop: 16, lineHeight: 2 }}>
        <li><a href="/bg/admin/specialists">Одобряване на специалисти</a></li>
        <li><a href="/bg/admin/categories">Категории</a></li>
        <li><a href="/bg/admin/listings">Обяви</a></li>
      </ul>
    </main>
  );
}