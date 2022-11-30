// import { GetStaticPaths, GetStaticProps } from 'next'
// import AddLiquiditySingle from 'views/AddLiquiditySingle'

// export default AddLiquiditySingle

// const OLD_PATH_STRUCTURE = /^(0x[a-fA-F0-9]{40}|ASA)-(0x[a-fA-F0-9]{40}|ASA)$/

// export const getStaticPaths: GetStaticPaths = () => {
//   return {
//     paths: [{ params: { currency: [] } }],
//     fallback: true,
//   }
// }

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const { currency = [] } = params
//   const [currencyIdA, currencyIdB] = currency
//   const match = currencyIdA?.match(OLD_PATH_STRUCTURE)

//   if (match?.length) {
//     return {
//       redirect: {
//         statusCode: 301,
//         destination: `/add-single/${match[1]}/${match[2]}`,
//       },
//     }
//   }

//   if (currencyIdA && currencyIdB && currencyIdA.toLowerCase() === currencyIdB.toLowerCase()) {
//     return {
//       redirect: {
//         statusCode: 303,
//         destination: `/add-single/${currencyIdA}`,
//       },
//     }
//   }

//   return {
//     props: {
//       isSingleLiquid: true,
//     },
//   }
// }
