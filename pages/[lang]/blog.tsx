import { useState } from 'react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';

import Layout from '@components/Layout';
import { getSortedPostData } from '@api';
import useTranslation from '@intl/useTranslations';
import { Title, Subtitle, Text, Caption } from '@components/Typography';
import { Excerpt } from '@components/Post';

interface Props {
  locale: string;
  allPostsData: {
    date: string;
    title: string;
    lang: string;
    description: string;
    category: string;
    excerpt: string;
    readTime: string;
    id: any;
  }[];
}

const Post: NextPage<Props> = ({ locale, allPostsData }) => {
  const { t } = useTranslation();
  const postsData = allPostsData.filter((post) => post.lang === locale);

  // Pagination
  const postsPerPage = 10;
  const numPages = Math.ceil(postsData.length / postsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const pagedPosts = postsData.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  // Date localization options
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
    <Layout className="posts" title={t('articles')}>
      <section className="page-content">
        <Title size="lg">{t('blogTitle')}</Title>
        {pagedPosts.map((post) => (
          <article key={post.id} className="post">
            <Excerpt>
              <Caption>{post.category}</Caption>
              <Link href={`/[lang]/blog/[id]`} as={`/${locale}/blog/${post.id}`}>
                <a>
                  <Subtitle>{post.title}</Subtitle>
                </a>
              </Link>
              <Text>
                <p>{post.excerpt}</p>
              </Text>
              <time>{new Date(post.date).toLocaleDateString(locale, dateOptions)}</time> •{' '}
              <span>
                {t('lecturaDe')} {post.readTime} MIN {t('readText')}
              </span>
            </Excerpt>
          </article>
        ))}

        {numPages > 1 && (
          <div className="pagination">
            {Array.from({ length: numPages }, (_, i) => (
              <button
                key={`pagination-number${i + 1}`}
                onClick={() => setCurrentPage(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const allPostsData = await getSortedPostData();

  return {
    props: {
      locale: ctx.params?.lang || 'es',
      allPostsData,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { lang: 'en' } }, { params: { lang: 'es' } }],
    fallback: false,
  };
};

export default Post;
