import React from 'react';
import styles from '../styles/Home.module.css'
import { NextPageContext  } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Parser from 'rss-parser';

const linkSymbol = <svg width="14px" height="14px" viewBox="0 0 24 24" className="css-1ctnorc"><g id="external_link" className="icon_svg-stroke" stroke="#666" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 13.5 17 19.5 5 19.5 5 7.5 11 7.5"></polyline><path d="M14,4.5 L20,4.5 L20,10.5 M20,4.5 L11,13.5"></path></g></svg>;

const FEEDS = [
  "https://thefullsnack.com/rss",
  "https://zerox-dg.github.io/blog/rss.xml",
  "https://quancam.net/rss",
  "https://learnlingo.co/feed/",
  "https://thuc.space/index.xml",
  "https://beautyoncode.com/feed/",
  "https://xluffy.github.io/index.xml",
  "https://tuhuynh.com/rss.xml",
  "https://ehkoo.com/rss.xml"
];

export const getServerSideProps = async ({ req }: NextPageContext) => {
  const parser = new Parser();
  const docs = (await Promise.all(FEEDS.map(async url => (await parser.parseURL(url)).items))).flat();
  docs.sort((a, b) => {
    let da = new Date(b.pubDate);
    let db = new Date(a.pubDate);
    return +da - +db;
  });
  return {
    props: {
      docs: docs
    }
  }
};

const getHostName = (url) => {
  const [host, _] = url.replace(/https?:\/\//, '').split('/');
  return host;
}

const Home = ({ docs }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>WeBuild Community Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {docs.map(doc => (
          <div className={styles.entry} key={doc.link}>
            <div className={styles.tag}>{getHostName(doc.link)}</div>
            <Link href={`/read?url=${doc.link}`}><h3>{doc.title}</h3></Link>
            <p>{new Date(doc.pubDate).toLocaleDateString()}</p>
            <p dangerouslySetInnerHTML={{ __html: doc.content.replace(/^"/, '').replace(/"$/, '') }}></p>
            <div className={styles.readMoreArea}>
              <Link href={`/read?url=${doc.link}`}>
                <button className={styles.primaryButton}>Read more...</button>
              </Link>
              <Link href={doc.link}>
                <button className={styles.secondaryButton}>Original link {linkSymbol}</button>
              </Link>
            </div>
          </div>
        ))}
      </main>

    </div>
  )
};

export default Home;