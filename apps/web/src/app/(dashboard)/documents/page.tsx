import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import type { Metadata } from "next";
import { setupI18nSSR } from "@documenso/lib/client-only/providers/i18n.server";
import { getRequiredServerComponentSession } from "@documenso/lib/next-auth/get-server-component-session";
import type { DocumentsPageViewProps } from "./documents-page-view";
import { DocumentsPageView } from "./documents-page-view";
import { UpcomingProfileClaimTeaser } from "./upcoming-profile-claim-teaser";

export type DocumentsPageProps = {
  searchParams?: DocumentsPageViewProps["searchParams"];
};

export const metadata: Metadata = {
  title: "Documents",
};

export default async function DocumentsPage({ searchParams = {}, }: DocumentsPageProps) {
  useEffect(() => {
  mixpanel.track('pending_documents_viewed');
  mixpanel.track('completed_documents_viewed');
  mixpanel.track('draft_documents_viewed');
  mixpanel.track('inbox_documents_viewed');
}, []);
  await setupI18nSSR();
  const { user } = await getRequiredServerComponentSession();
  return (
    <>
      <UpcomingProfileClaimTeaser user={user} />
      <DocumentsPageView searchParams={searchParams} />
    </>
  );
}
