// 1. `astro:content`からユーティリティをインポート
import { defineCollection } from 'astro:content';
// 2. コレクションを定義
const blogCollection = defineCollection({ 
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),

        pubDate: z.date(),
        
        updatedDate: z.date().optional(),
    }),
});
export const collections = {
  'blog': blogCollection,
};