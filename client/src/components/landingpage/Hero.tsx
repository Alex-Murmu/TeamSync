import { SignupForm } from '../signupPage/signup-form'
import { HeroHeading } from './HeroHeading'
function Hero() {
    return (
        <section
            className="relative flex flex-col items-center justify-center pt-0 pb-16 px-4">
            
            <HeroHeading />
            <p className="mt-6 max-w-2xl text-center text-lg text-muted-foreground">
                TeamSync brings your team's goals, tasks, and files together. Stop searching through tabs and start shipping.
            </p>

            <div className="mt-10 flex items-center gap-x-6">

                <SignupForm />

                <a href="#features" className="text-sm font-semibold leading-6 text-foreground">
                    Learn more <span aria-hidden="true">→</span>
                </a>
            </div>


        </section>

    )
}

export default Hero