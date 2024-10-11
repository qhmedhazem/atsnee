import { cn } from "@/lib/utils";
import Link from "@/components/ui/Link";
import { FC, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {}

const AdmissionInfo: FC<Props> = ({ className, children, ...props }) => {
  return (
    <section className={cn("w-full flex flex-col gap-8", className)} {...props}>
      <div className="space-y-2">
        <h2 className="text-4xl font-bold lg:mt-8">Admission Process</h2>
        <div className="space-y-2">
          The admissions process for El Dabaa Nuclear School is highly
          competitive, reflecting the rigorous standards and demanding nature of
          the program. Only the most exceptional students who demonstrate
          excellence in academics, physical fitness, and personal qualities will
          be selected to join this prestigious institution. Apply now to join{" "}
          ATSNEE through the{" "}
          <Link
            className="text-light-blue-500 underline"
            href="https://dualedu.moe.gov.eg/loginWithMsSucess"
          >
            Dual Education Official Application Portal
          </Link>
          .
        </div>
      </div>
    </section>
  );
};

export default AdmissionInfo;

//
