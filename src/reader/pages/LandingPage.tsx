export function LandingPage() {
  const subforums = [
    { id: "2212", name: "English Patch Notes" },
    { id: "2272", name: "Russian Patch Notes" },
  ];
  return (
    <div class="container">
      <div class="featured">
        <a href="/thread/3932540" class="featured-link">
          <span class="featured-label">0.5.0 Patch Notes — EN</span>
          <span class="featured-title">
            Content Update 0.5.0 — Path of Exile 2: Return of the Ancients
          </span>
          <span class="featured-arrow">→</span>
        </a>
        <a href="/thread/3932617" class="featured-link">
          <span class="featured-label">0.5.0 Patch Notes — RU</span>
          <span class="featured-title">
            Обновление 0.5.0 — Path of Exile 2: Возвращение Древних
          </span>
          <span class="featured-arrow">→</span>
        </a>
      </div>
      <h2 class="forums-heading">Forums</h2>
      <div class="forum-cards">
        {subforums.map((sf) => (
          <a href={`/forum/${sf.id}`} class="forum-card">
            <span class="forum-card-title">{sf.name}</span>
            <span class="forum-card-arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
