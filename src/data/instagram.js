/* =========================================================
   RÉALISATIONS / FEED INSTAGRAM — VERSION SANS API
   ---------------------------------------------------------
   Cette première version n'est PAS connectée à Instagram.
   On gère les publications à la main, c'est simple et fiable.

   ▶ Pour AJOUTER UNE PUBLICATION avec image :
     1. Déposez l'image dans  public/images/instagram/
        (ex : public/images/instagram/post-sweat.jpg)
     2. Ajoutez un objet ci-dessous avec le nom du fichier.

   Champs :
     - image    : nom du fichier dans public/images/instagram/ (ou null)
     - caption  : petite légende
     - link     : lien vers le post Instagram (facultatif)
     - featured : true => la publication occupe une grande case

   ▶ PLUS TARD (connexion automatique) : on remplacera ce tableau
     par un appel à l'API Instagram Graph OU un widget tiers
     (Behold, Elfsight, SnapWidget). La logique d'affichage
     (InstagramFeed.vue) n'aura pas besoin de changer.
   ========================================================= */

export const instagramHandle = '@Faithson_Custom'
export const instagramUrl = 'https://instagram.com/faithson_custom'

export const instagramPosts = [
  { image: null, caption: 'Post à la une', link: instagramUrl, featured: true },
  { image: null, caption: 'Sérigraphie 2 couleurs', link: instagramUrl },
  { image: null, caption: 'Broderie logo', link: instagramUrl },
  { image: null, caption: 'Série association', link: instagramUrl },
  { image: null, caption: 'Flocage numéros', link: instagramUrl },
  { image: null, caption: 'Totebags event', link: instagramUrl },
  { image: null, caption: 'Casquettes brodées', link: instagramUrl }
]
