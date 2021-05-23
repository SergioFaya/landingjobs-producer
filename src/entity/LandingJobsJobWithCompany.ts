export interface LandingJobsJobWithCompany {
	id: number;
	city: string;
	company: string;
	company_logo_url: string;
	country_code: string;
	country_name: string;
	currency_code: string;
	expires_at: string;
	nice_to_have: string;
	perks: string;
	published_at: string;
	reward: number;
	remote: boolean;
	relocation_paid: boolean;
	role_description: string;
	salary_low?: any;
	salary_high?: any;
	'successful?': boolean;
	title: string;
	work_from_home: boolean;
	created_at: string;
	updated_at: string;
	type: string;
	tags: string[];
}