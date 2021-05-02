import axios, { AxiosResponse } from "axios";
import { LandingJobsApiParams, MAX_LIMIT_RESULTS_API } from "../entity/LandingJobsApiParams";
import { LandingJobsJob } from "../entity/LandingJobsJob";
import { LandingJobsJobWithCompanyName } from "../entity/LandingJobsJobWithCompanyName";

/**
 * Gets the information about the jobs and companies
 */

const COMPANIES_URL_JOBS = "/jobs"
const COMPANIES_URL = "https://landing.jobs/api/v1/companies/"



export async function getCompanies(params: LandingJobsApiParams): Promise<LandingJobsCompany[]> {
	return await (await axios.get<LandingJobsCompany[]>(COMPANIES_URL, { params })).data
}

export async function getJobsOfCompanies(companies: LandingJobsCompany[], params: LandingJobsApiParams): Promise<LandingJobsJobWithCompanyName[]> {
	let jobs: LandingJobsJobWithCompanyName[] = []
	for (let i in companies) {
		const company = companies[i]

		let response = await (await axios.get<LandingJobsJob[]>(COMPANIES_URL + company.id + COMPANIES_URL_JOBS, { params }));

		while (response.data.length != 0) {
			jobs = jobs.concat(await renameCompany(response.data, company));
			params.offset += params.limit;
			response = await (await axios.get<LandingJobsJob[]>(COMPANIES_URL + company.id + COMPANIES_URL_JOBS, { params }));
		}
	}
	return jobs;
}

async function renameCompany(jobs: LandingJobsJob[], company: LandingJobsCompany): Promise<LandingJobsJobWithCompanyName[]> {
	const jobsWithCompany = jobs.map((job) => {
		const { id, city, country_code, country_name,
			currency_code, expires_at, nice_to_have,
			perks, published_at, reward, remote, relocation_paid,
			role_description, salary_low, salary_high, title,
			work_from_home, created_at, updated_at, type, tags } = job;

		const jobWithCompany: LandingJobsJobWithCompanyName = {
			id, city, company: company.name,
			country_code, country_name, currency_code,
			expires_at, nice_to_have, perks,
			published_at, reward, remote,
			relocation_paid, role_description, salary_low,
			salary_high, 'successful?': job["successful?"],
			title, work_from_home, created_at,
			updated_at, type, tags,
		}
		return jobWithCompany;
	});

	return jobsWithCompany;
}
