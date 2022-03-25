// * useRouter Hook is used to get the current URL.
// This is a dynamic route for the car page (pages/cars/index.js).
// It is used to render the car page.
// It allows us to access the query params and the route params from the URL.

// cars/tesla
// cars/lambo
// cars/...

import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import styles from "../../styles/Home.module.css";

export default function Car({ car }) {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className={styles.container}>
      <Head>
        <title>
          {car.color} {car.id}
        </title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>{id}</h1>
        <img src={car.image} width="300px" />
        <Link href="/cars">
          <a>🔙</a>
        </Link>
      </main>
    </div>
  );
}

// * Option A: (Server Side Rendering) SSR
// * The server needs to render the page before sending it to the user (render at runtime).
// [https://nextjs.org/docs/basic-features/data-fetching/get-server-side-props]
export async function getServerSideProps({ params }) {
  const req = await fetch(`http://localhost:3000/${params.id}.json`);
  const data = await req.json();
  return {
    props: { car: data },
  };
}

// * Option B: (Static Site Generation) SSG
// * The page is pre-rendered at compile time.
// [https://nextjs.org/docs/basic-features/data-fetching/get-static-props]
/*
export async function getStaticProps({ params }) {
  const req = await fetch(`http://localhost:3000/${params.id}.json`);
  const data = await req.json();
  return {
    props: { car: data },
  };
} 
*/
// * Option B: Dynamic routing
// How does Next.js know which dynamic page to render? getStaticPaths we return a paths object for every route for the dynamic URL.
// If a page has (Dynamic Routes) and uses getStaticProps, it needs to define a static list of paths.
// [https://nextjs.org/docs/basic-features/data-fetching/get-static-paths]
/*
export async function getStaticPaths() {
  const req = await fetch(`http://localhost:3000/cars.json`);
  const data = await req.json();
  const paths = data.map((car) => {
    return { params: { id: car } };
  });
  return {
    paths,
    fallback: false,
  };
}
*/
