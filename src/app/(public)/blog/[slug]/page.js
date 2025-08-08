

export default async function Blog({ params }) {

    const { slug } = await params

    console.log(slug)

    return (
        <>
            <h1>Blog {slug}</h1>
        </>
    )
}