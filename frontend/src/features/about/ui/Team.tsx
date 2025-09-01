import { useEffect, useRef, useState } from "react"
import type { TeamMember } from "../types/TeamMember"
import { getTeam } from "../api/team"
import { gsap } from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollToPlugin)

export const Team = () => {
    const [members, setMembers] = useState<TeamMember[]>([])
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        getTeam().then(setMembers)
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            if (!containerRef.current) return
            const width = containerRef.current.offsetWidth
            const maxScroll = containerRef.current.scrollWidth - width
            const step = window.innerWidth < 768 ? width * 0.7 : width / 2

            if (containerRef.current.scrollLeft >= maxScroll - 10) {
                gsap.to(containerRef.current, {
                    scrollTo: { x: 0 },
                    duration: 0.8,
                    ease: "power2.inOut",
                })
            } else {
                gsap.to(containerRef.current, {
                    scrollTo: { x: containerRef.current.scrollLeft + step },
                    duration: 0.8,
                    ease: "power2.inOut",
                })
            }
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="py-16 px-6 sm:px-10 lg:px-20 bg-base-200">
            <h2 className="text-3xl font-bold mb-8 text-center">Команда</h2>
            <div
                ref={containerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hidden scroll-smooth px-2"
            >
                {members.map((member) => (
                    <div
                        key={member.ID}
                        className="card bg-base-100 w-72 min-w-[18rem] shadow-sm flex-shrink-0"
                    >
                        {member.PhotoURL && (
                            <figure className="h-80 w-full overflow-hidden">
                                <img
                                    src={member.PhotoURL}
                                    alt={member.Name}
                                    className="h-full w-full object-cover"
                                />
                            </figure>
                        )}
                        <div className="card-body">
                            <h2 className="card-title">{member.Name}</h2>
                            <p className="text-sm text-blue-500">{member.Position}</p>
                            {member.Bio && (
                                <p className="text-sm text-base-content/70 mt-2">{member.Bio}</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
