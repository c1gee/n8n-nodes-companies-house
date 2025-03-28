import {
	ICredentialType,
} from 'n8n-workflow';

export class CompaniesHouseApi implements ICredentialType {
	name = 'companiesHouseApi';
	displayName = 'Companies House API';
	documentationUrl = 'https://developer.company-information.service.gov.uk/';
	properties = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as const,
			default: '',
			required: true,
			typeOptions: {
				password: true,
			},
		},
	];

	authenticate = {
		type: 'generic' as const,
		properties: {
			headers: {
				Authorization: '={{"Basic " + Buffer.from($credentials.apiKey + ":").toString("base64")}}',
			},
		},
	};
}
