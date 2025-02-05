import { Navbar } from "../components/Navbar"
import { Hero } from "../components/Hero"

function Home() {
  return (
    <div className="flex flex-col">
      <Navbar/>
      <Hero/>
    </div>
  )
}

export default Home
