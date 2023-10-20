import Head from 'next/head';
export default function Title(props) {
  return (
    <div>
        <Head>
            <title>{props.title}</title>
        </Head>
    </div>
  )
}
