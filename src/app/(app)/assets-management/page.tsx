
import { PageHeader } from "@/components/page-header";
import { AssetMaster } from "@/components/assets/asset-master";

export default function AssetsManagementPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Assets Management"
        description="A centralized inventory for tracking all company assets."
      />
      <AssetMaster />
    </div>
  );
}
