import { PageHeader } from "@/components/page-header";
import { ZbmOverhaul } from "@/components/zbm/zbm-overhaul";

export default function ZbmPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Zero-Based Maintenance (ZBM) Overhaul"
        description="Conduct and record full equipment restoration cycles to establish a new reliability baseline."
      />
      <ZbmOverhaul />
    </div>
  );
}
