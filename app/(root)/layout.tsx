
import BottomBar from "@/components/shared/BottomBar"
import LeftSideBar from "@/components/shared/LeftSideBar"
import RightSideBar from "@/components/shared/RightSideBar"
import TopBar from "@/components/shared/TopBar"
import "tw-elements-react/dist/css/tw-elements-react.min.css";
import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: 'Threads',
  description: 'A Next.js 13 Meta Threads Application',
}
import Providers from "./Providers";
import ThemeSwitcher from "./ThemeSwitcher";

import  "../globals.css"
import { Metadata } from "next"

const RootLayout =({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
        <Providers>
          {/* <ThemeSwitcher /> */}

          <TopBar />

          <main className="flex flex-row">
            <LeftSideBar />

            <section className="main-container">
              <div className="w-full max-w-3xl">
                {children}
              </div>
            </section>

            <RightSideBar />
          </main>

          <BottomBar />
          
        </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}

export default RootLayout