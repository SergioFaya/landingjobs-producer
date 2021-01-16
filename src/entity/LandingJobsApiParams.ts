// max limit and offset are 50

export const MAX_LIMIT_RESULTS_API = 50;

export interface LandingJobsApiParams {
	limit?: number,
	offset: number
}