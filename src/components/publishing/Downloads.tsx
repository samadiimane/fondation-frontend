"use client";

import { Button } from "@/components/ui/button";

type DownloadItem = {
  label: string;
  description: string;
  href: string;
};

type DownloadsProps = {
  items: DownloadItem[];
  downloadAllLabel: string;
  downloadAllHref: string;
};

const Downloads = ({ items, downloadAllLabel, downloadAllHref }: DownloadsProps) => (
  <div className="publishing-templates">
    {items.map((item) => (
      <div key={item.label} className="publishing-template-card">
        <div className="publishing-template-card__title">{item.label}</div>
        <p className="publishing-template-card__desc">{item.description}</p>
        <div className="publishing-template-actions">
          <Button asChild variant="outline">
            <a href={item.href} download>
              {item.label}
            </a>
          </Button>
        </div>
      </div>
    ))}

    <div className="publishing-template-actions">
      <Button asChild className="publishing-download-all">
        <a href={downloadAllHref} download>
          {downloadAllLabel}
        </a>
      </Button>
    </div>
  </div>
);

export default Downloads;
