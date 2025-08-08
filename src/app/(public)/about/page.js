

export default async function About({ params }) {

    const { param } = await params

    console.log(param)

    return (
        <>
            <h1>About</h1>
        </>
    )
}