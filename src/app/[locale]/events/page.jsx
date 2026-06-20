import { redirect } from "next/navigation";

const EventsPage = async ({ params }) => {
  const { locale } = await params;
  redirect(`/${locale}/events/seminars`);
};

export default EventsPage;
