import { ecom } from 'src/helper/ecomAssets';

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
  body: string;
  category: string;
  minutes: number;
  author: string;
}

export const blogCategories = ['Guides', 'Sellers', 'Trends', 'Checkout'] as const;

export const blogPosts: BlogPost[] = [
  {
    slug: 'marketplace-trends-2026',
    title: 'Marketplace trends to watch in 2026',
    excerpt: 'What shoppers and vendors should prepare for this year across Cambodia.',
    date: 'Aug 10, 2026',
    image: ecom('imgs/page/blog/blog-1.jpg'),
    body: 'Marketplace growth continues as buyers expect faster delivery, clearer returns, and richer product media. Vendors who invest in trust signals and accurate inventory win more repeat orders. In Cambodia, KHQR and COD remain table stakes — pair them with clear province coverage and you reduce cart abandonment.',
    category: 'Trends',
    minutes: 5,
    author: 'Zcomus Team',
  },
  {
    slug: 'better-product-photos',
    title: 'How to shoot better product photos',
    excerpt: 'Simple lighting tips that lift conversion rates on mobile.',
    date: 'Aug 4, 2026',
    image: ecom('imgs/page/blog/blog-2.jpg'),
    body: 'Natural light, a clean backdrop, and consistent angles help shoppers understand scale and finish. Add detail crops for ports, fabric, and packaging to cut returns. Shoot on a phone if needed — just keep white balance steady across your catalog.',
    category: 'Guides',
    minutes: 4,
    author: 'Zcomus Team',
  },
  {
    slug: 'vendor-growth-playbook',
    title: 'Vendor growth playbook',
    excerpt: 'From first listing to repeat buyers in Phnom Penh and the provinces.',
    date: 'Jul 28, 2026',
    image: ecom('imgs/page/blog/blog-3.jpg'),
    body: 'Start with a tight catalog, respond to questions quickly, and bundle complementary items. Track which listings convert, then expand into adjacent categories. Highlight delivery windows and return policy on every listing page.',
    category: 'Sellers',
    minutes: 6,
    author: 'Zcomus Team',
  },
  {
    slug: 'checkout-ux-checklist',
    title: 'Checkout UX checklist',
    excerpt: 'Reduce abandoned carts with these Cambodia-ready fixes.',
    date: 'Jul 20, 2026',
    image: ecom('imgs/page/blog/blog-4.jpg'),
    body: 'Show shipping costs early, support guest checkout, and keep form fields minimal. Progress indicators and clear payment options — KHQR, ABA, Wing, COD — reduce drop-off on mobile. Confirm the order with SMS when possible.',
    category: 'Checkout',
    minutes: 3,
    author: 'Zcomus Team',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
