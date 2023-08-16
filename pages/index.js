import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import Layout, { siteTitle } from '../components/Layout';

import utilStyles from '../styles/utils.module.css';
import { getPostsData } from '../lib/post';

// SSG
export async function getStaticProps() {
    const allPostsData = getPostsData(); // id, date, title, thumbnail
    /* console.log(allPostsData); */

    return {
        props: {
            allPostsData,
        },
    };
}

export default function Home({ allPostsData }) {
    return (
        <Layout home>
            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={utilStyles.headingMd}>
                <p>主にフロントエンドのコーディングに関するブログです。</p>
            </section>
            <section>
                <h2>Blog</h2>
                <div className={styles.grid}>
                    {allPostsData.map(({ id, title, date, thumbnail }) => (
                        <article key={id}>
                            <Link href={`/posts/${id}`}>
                                <img src={thumbnail} className={styles.thumbnailImage} />
                            </Link>
                            <Link href={`/posts/${id}`}>
                                <span className={utilStyles.boldText}>{title}</span>
                            </Link>
                            <div>
                                <small className={utilStyles.lightText}>{date}</small>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </Layout>
    );
}
