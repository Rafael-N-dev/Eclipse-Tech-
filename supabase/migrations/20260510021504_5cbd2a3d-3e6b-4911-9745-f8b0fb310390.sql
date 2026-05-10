
-- Storage bucket for AI-generated post cover images
insert into storage.buckets (id, name, public)
values ('post-covers', 'post-covers', true)
on conflict (id) do update set public = true;

-- Public read access; writes via service role only (bypasses RLS)
drop policy if exists "Public read post covers" on storage.objects;
create policy "Public read post covers"
on storage.objects for select
using (bucket_id = 'post-covers');

-- Ensure required extensions
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Remove previous schedule (if any) and re-create three daily schedules
do $$
declare j record;
begin
  for j in select jobname from cron.job where jobname in (
    'daily-ai-post','daily-ai-post-morning','daily-ai-post-afternoon','daily-ai-post-evening'
  ) loop
    perform cron.unschedule(j.jobname);
  end loop;
end $$;

-- 09:00 BRT = 12:00 UTC
select cron.schedule(
  'daily-ai-post-morning',
  '0 12 * * *',
  $$
  select net.http_post(
    url := 'https://project--d99ed1ac-4743-4758-9078-035bb68a9318.lovable.app/api/public/hooks/daily-post',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5dmJnZmJraXFtamd0eWhqa3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMTU2MTQsImV4cCI6MjA5MzY5MTYxNH0.VMM1ZCJsqlXCkVd4WQ_i_qarnrE_fmGeZ9MHwmBbiiA"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- 13:00 BRT = 16:00 UTC
select cron.schedule(
  'daily-ai-post-afternoon',
  '0 16 * * *',
  $$
  select net.http_post(
    url := 'https://project--d99ed1ac-4743-4758-9078-035bb68a9318.lovable.app/api/public/hooks/daily-post',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5dmJnZmJraXFtamd0eWhqa3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMTU2MTQsImV4cCI6MjA5MzY5MTYxNH0.VMM1ZCJsqlXCkVd4WQ_i_qarnrE_fmGeZ9MHwmBbiiA"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);

-- 19:00 BRT = 22:00 UTC
select cron.schedule(
  'daily-ai-post-evening',
  '0 22 * * *',
  $$
  select net.http_post(
    url := 'https://project--d99ed1ac-4743-4758-9078-035bb68a9318.lovable.app/api/public/hooks/daily-post',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5dmJnZmJraXFtamd0eWhqa3pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxMTU2MTQsImV4cCI6MjA5MzY5MTYxNH0.VMM1ZCJsqlXCkVd4WQ_i_qarnrE_fmGeZ9MHwmBbiiA"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $$
);
