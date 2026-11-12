(() => {
  const grid = document.getElementById('worksGrid');
  const projects = Array.isArray(window.workProjects) ? window.workProjects : [];
  const safeUrl = (url) => /^https?:\/\//i.test(url || '');

  grid.innerHTML = projects.map((project) => {
    const links = (project.links || []).map((link) => {
      const usable = safeUrl(link.url);
      const cls = link.kind === 'primary' ? 'work-link work-link-primary' : 'work-link';
      if (!usable) return `<span class="${cls} is-placeholder" aria-disabled="true" title="Add this URL in works-data.js">${link.label} <small>URL needed</small></span>`;
      return `<a class="${cls}" href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label} <span aria-hidden="true">↗</span></a>`;
    }).join('');
    const tags = (project.tags || []).map(tag => `<span>${tag}</span>`).join('');
    return `<article class="work-card" id="${project.id}">
      <div class="work-card-top"><span class="work-number">${project.number}</span><span class="work-category">${project.category}</span></div>
      <div class="work-card-body"><h3>${project.name}<span>.</span></h3><p>${project.description}</p><div class="work-tags">${tags}</div></div>
      <div class="work-card-links">${links}</div>
    </article>`;
  }).join('');

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
