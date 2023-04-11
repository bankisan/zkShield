import { cn } from "@/utils/cn";

type NavProps = {
  currentStepIndex: number;
  goTo: (index: number) => void;
};

const SideBar = ({ currentStepIndex, goTo }: NavProps) => {
  return (
    <div className="absolute -top-20 left-0 w-full md:w-[25%] md:relative md:top-0 md:left-0">
      <nav className="py-5 text-slate-200 bg-neutral-900 h-full rounded-md border border-neutral-700 md:p-5">
        <ul className="flex justify-center gap-2 md:flex-col">
          <li className="flex flex-col items-start font-medium">
            <span className="hidden text-neutral-500 uppercase text-sm md:flex">
              step 1
            </span>
            <button
              tabIndex={0}
              onClick={() => goTo(0)}
              className={`text-sm ${
                currentStepIndex === 0 ? "text-[#ffe666]" : "text-white"
              } md:text-base`}
            >
              <div
                className={cn("text-[#ffe666]", currentStepIndex === 0 ? "underline" : "text-white")}
              >
                Sign In
              </div>
            </button>
          </li>
          <li className="flex flex-col items-start font-medium">
            <span className="hidden text-neutral-500 uppercase text-sm md:flex">
              step 2
            </span>
            <button
              tabIndex={0}
              onClick={() => goTo(1)}
              className={`text-sm ${
                currentStepIndex === 1 ? "text-[#E7B8FF]" : "text-white"
              } md:text-base`}
            >
              <div
                className={cn("text-[#E7B8FF]", currentStepIndex === 1 ? "underline" : "text-white")}
              >
                Nullifier
              </div>
            </button>
          </li>
          <li className="flex flex-col items-start font-medium">
            <span className="hidden text-neutral-500 uppercase text-sm md:flex">
              step 3
            </span>
            <button
              tabIndex={0}
              onClick={() => goTo(2)}
              className={`text-sm ${
                currentStepIndex === 2 ? "text-[#bd284d]" : "text-white"
              } md:text-base`}
            >
              <div
                className={cn("text-[#bd284d]", currentStepIndex === 2 ? "underline" : "text-white")}
              >
                User Op
              </div>
            </button>
          </li>
          <li className="flex flex-col items-start font-medium">
            <span className="hidden text-neutral-500 uppercase text-sm md:flex">
              step 4
            </span>
            <button
              tabIndex={0}
              onClick={() => goTo(3)}
              className={`text-sm ${
                currentStepIndex === 3 ? "text-[#6fe79f]" : "text-white"
              } md:text-base`}
            >
              <div
                className={cn("text-[#6fe79f]", currentStepIndex === 3 ? "underline" : "text-white")}
              >
                Prover
              </div>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideBar;
