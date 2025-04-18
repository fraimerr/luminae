export default function TermsOfServicePage() {
	return (
		<article className="container max-w-3xl py-12">
			<header className="mb-12">
				<h1 className="text-4xl font-bold tracking-tight mb-4">
					Terms of Service
				</h1>
				<p className="text-muted-foreground">
					Last updated: 17th April 2025
                    <br />
                    Effective: 18th April 2025
				</p>
			</header>

			<div className="prose prose-gray dark:prose-invert max-w-none space-y-12">
				<section>
					<h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
					<p className="text-muted-foreground">
						By inviting Parallel Bot to your Discord server, you agree to be
						bound by these Terms of Service. These terms constitute a legally
						binding agreement between you and Parallel Bot. If you disagree with
						any part of these terms, you must not use our service. By continuing
						to use our service, you acknowledge that you have read and
						understood these terms.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Use License</h2>
					<p className="text-muted-foreground mb-6">
						We grant you a limited, non-exclusive, non-transferable license to
						use Parallel Bot in your Discord server. This license permits you to
						configure bot settings for your server and access all available
						dashboard features. The license is specific to your Discord server
						and cannot be transferred to another party.
					</p>
					<p className="text-muted-foreground">
						This license explicitly prohibits certain activities to protect our
						service and users. You may not modify or copy the bot&apos;s code,
						attempt to extract the source code, use the bot for any illegal
						purposes, or transfer your license to another party. Any attempt to
						do so will result in immediate termination of your license and may
						lead to legal action.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
					<p className="text-muted-foreground">
						While we strive to provide 24/7 uptime for Parallel Bot, we cannot
						guarantee continuous, uninterrupted access to our services. The
						bot&apos;s availability and response time for commands may vary
						based on various factors, including but not limited to server load,
						network conditions, and scheduled maintenance. We reserve the right
						to modify, suspend, or discontinue any aspect of our service at any
						time without prior notice. Data retention periods may also vary
						based on operational requirements and legal obligations.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">User Responsibilities</h2>
					<p className="text-muted-foreground">
						As a user of Parallel Bot, you bear important responsibilities in
						maintaining the security and proper operation of the bot within your
						server. You must ensure proper configuration of bot permissions and
						maintain the security of your Discord server. You are solely
						responsible for all content created using bot commands and must
						ensure compliance with Discord&apos;s Terms of Service. Any misuse
						of bot features or violation of these responsibilities may result in
						service termination.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Termination</h2>
					<p className="text-muted-foreground">
						We reserve the right to terminate or suspend your access to our
						service immediately, without prior notice or liability, for any
						reason we deem appropriate. This includes, but is not limited to,
						breaches of these Terms, abuse of bot features, suspicious activity,
						or any action that we believe may harm our service or other users.
						Upon termination, your right to use the service will immediately
						cease. We may also pursue legal action if necessary to protect our
						rights and interests.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
					<p className="text-muted-foreground">
						We reserve the right to modify these terms at any time to reflect
						changes in our services, legal requirements, or business operations.
						When we make changes, we will notify users through our support
						server, update the &quot;last modified&quot; date at the top of
						these terms, and send direct messages to server owners when
						significant changes occur. Your continued use of Parallel Bot after
						such modifications constitutes your acceptance of the updated terms.
					</p>
				</section>

				<section>
					<h2 className="text-2xl font-semibold mb-4">Contact</h2>
					<p className="text-muted-foreground">
						If you have any questions or concerns about these Terms of Service,
						we encourage you to reach out to us. The most efficient way to get
						assistance is by joining our Discord support server, where our team
						can address your inquiries directly. For formal communications, you
						can contact us via email at support@parallel-bot.com. We strive to
						respond to all inquiries promptly and thoroughly.
					</p>
				</section>
			</div>
		</article>
	);
}
