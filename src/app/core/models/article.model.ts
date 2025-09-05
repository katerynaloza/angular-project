export interface ArticleData {
    id: number;
    title: string;
    summary: string;
    imageUrl: string;
    publishedAt: string;  
    url: string;
}

export interface ArticleDetail extends ArticleData {
    contentHTML: string;   
}