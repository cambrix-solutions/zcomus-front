import { ecom } from 'src/helper/ecomAssets';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  body: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'marketplace-trends-2026',
    title: 'Marketplace trends to watch in 2026',
    excerpt: 'What shoppers and vendors should prepare for this year.',
    date: 'Aug 10, 2026',
    image: ecom('imgs/page/homepage1/imgsp2.png'),
    body: 'Marketplace growth continues as buyers expect faster delivery, clearer returns, and richer product media. Vendors who invest in trust signals and accurate inventory win more repeat orders.',
  },
  {
    slug: 'better-product-photos',
    title: 'How to shoot better product photos',
    excerpt: 'Simple lighting tips that lift conversion rates.',
    date: 'Aug 4, 2026',
    image: ecom('imgs/page/homepage1/imgsp3.png'),
    body: 'Natural light, a clean backdrop, and consistent angles help shoppers understand scale and finish. Add detail crops for ports, fabric, and packaging to cut returns.',
  },
  {
    slug: 'vendor-growth-playbook',
    title: 'Vendor growth playbook',
    excerpt: 'From first listing to repeat buyers.',
    date: 'Jul 28, 2026',
    image: ecom('imgs/page/homepage1/imgsp4.png'),
    body: 'Start with a tight catalog, respond to questions quickly, and bundle complementary items. Track which listings convert, then expand into adjacent categories.',
  },
  {
    slug: 'checkout-ux-checklist',
    title: 'Checkout UX checklist',
    excerpt: 'Reduce abandoned carts with these fixes.',
    date: 'Jul 20, 2026',
    image: ecom('imgs/page/homepage1/imgsp5.png'),
    body: 'Show shipping costs early, support guest checkout, and keep form fields minimal. Progress indicators and clear payment options reduce drop-off on mobile.',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
