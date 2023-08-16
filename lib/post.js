import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

// mdファイルのデータを取り出す
export function getPostsData() {
    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, ''); // ファイル名(id)

        // マークダウンファイルを文字列として読み取る
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        const matterResult = matter(fileContents);

        return {
            id,
            ...matterResult.data,
        };
    });
    return allPostsData;
}

// getStaticPathsでreturnで使うpathを取得する
export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, ''),
            },
        };
    });
    /* 超重要: paramsは必ずこの名前で格納するルール。idというkey名は[id].jsと紐づいている。
        [
            {
                params: {
                    id: "ssg-ssr"
                }
            },
            {
                params: {
                    id: "ssg-ssr"
                }
            },
            {
                params: {
                    id: "ssg-ssr"
                }
            },
        ]
    */
}

// idに基づいてブログ投稿データを返す関数
// メタデータ、本文をhtmlに変換する
export async function getPostData(id) {
    const fullPath = path.join(postsDirectory, `${id}.md`);
    const fileContent = fs.readFileSync(fullPath, 'utf8');

    const matterResult = matter(fileContent);

    const blogContent = await remark().use(html).process(matterResult.content);

    const blogContentHTML = blogContent.toString();

    /* console.log(matterResult); */

    return {
        id,
        blogContentHTML,
        ...matterResult.data,
    };
}
