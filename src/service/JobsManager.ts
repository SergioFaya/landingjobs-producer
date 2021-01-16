import axios, { AxiosResponse } from "axios";
import { LandingJobsApiParams, MAX_LIMIT_RESULTS_API } from "../entity/LandingJobsApiParams";
import { LandingJobsJob } from "../entity/LandingJobsJob";

/**
 * Gets the information about the jobs and companies
 */

const JOBS_URL = "https://landing.jobs/api/v1/jobs"
const COMPANIES_URL = "https://landing.jobs/api/v1/companies"


export async function getLandingJobsData(): Promise<LandingJobsJob[]> {
	const companies: LandingJobsCompany[] = await getCompanies();
	return await getJobsOfCompanies(companies);
}


async function getCompanies(): Promise<LandingJobsCompany[]> {
	const params: LandingJobsApiParams = { offset: 0 }
	const companies: LandingJobsCompany[] = []

	const response = await axios.get<LandingJobsCompany[]>(COMPANIES_URL, { params })
	while (response.data.length != 0) {
		companies.concat(response.data)
		params.offset += MAX_LIMIT_RESULTS_API;
	}
	return companies
}

async function getJobsOfCompanies(companies: LandingJobsCompany[]): Promise<LandingJobsJob[]> {
	const companyIds = companies.map(company => company.id);

	const params: LandingJobsApiParams = { offset: 0 }
	const jobs: LandingJobsJob[] = []

	const response = await axios.get<LandingJobsJob[]>(JOBS_URL, { params })
	while (response.data.length != 0) {
		jobs.concat(response.data)
		params.offset += MAX_LIMIT_RESULTS_API;
	}
	return jobs
}