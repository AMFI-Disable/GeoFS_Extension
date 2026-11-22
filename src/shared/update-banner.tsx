import type { UpdateInfo } from './update-checker';

interface UpdateBannerProps {
  info: UpdateInfo | null;
  showNotes?: boolean;
}

export function UpdateBanner({ info, showNotes = false }: UpdateBannerProps) {
  if (!info) return null;
  return (
    <div class="update-banner">
      <div style="min-width:0;flex:1;">
        <div>
          Update <strong>v{info.latestVersion}</strong> available
          {showNotes ? ` (current: v${info.currentVersion})` : ''}
        </div>
        {showNotes && info.releaseNotes && (
          <div class="muted-hint" style="margin-top:3px;font-size:11px;">
            {info.releaseNotes}
          </div>
        )}
      </div>
      <a
        href={info.downloadUrl}
        target="_blank"
        rel="noreferrer"
        class="update-banner-link"
      >
        {showNotes ? 'Download Latest ZIP ↗' : 'Download ↗'}
      </a>
    </div>
  );
}
