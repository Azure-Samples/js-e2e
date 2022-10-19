<!--

Expect this to be filled out roughly - without consideration for spelling, grammar, sentence style, or Microsoft style guidelines. Just a brain dump. 

If there is a section that you know applies but you don't have the answers yet, please mark it TBD. 

If there is a section that doesn't apply - please state that explicitly instead of skipping it. 

If there is a section that you know is confusing or problematic, please describe that. 

If you can record video where the steps are tricky to setup, that would be great. 

-->

# E2E scenario template

This **enter a name for scenario** implements ... in order to solve ...

## Use Case

This scenario was designed to solve the problem of ...

This scenario is intended to be implemented by (finish with roles such as Dev Manager, FE/BE/FS engineer, QA engineer, etc).

## Architecture

This architecture shows how to implement ...

Include an architecture diagram

The list of Azure resources includes: 

The list of tools to implement this scenario includes:

What cloud planes are involved and how: 
* Management plane
* Control plane
* Data plane

Some SDKs combine control and data plane together. If you know the scenario uses an SDK that does this, please state that. 

## Implementation summary

This implementation can be broken down into the following groups of tasks:

* Group 1
    * Task 1
        * List of files, tools, websites that need to be shown/explained to understand the steps
    * Task 2
    * Task 3
* Group 2
* Group 3

Link to any videos that would show procedures/steps to complete

## Implementation steps

Each group or task needs to be broken down into steps you expect a customer to complete. Don't focus on grammar, spelling. Focus on the tool used and steps. If the tool isn't common, you may want to add a few more steps. 

Please be aware that the resources and configuration of this scenario needs to be automated in order for future-proofing of the scenario. For example, if a bug comes in against the scenario in a year, and someone new to the team has to verify and fix the content, this script helps them spend time on the issue and not the steps to spin up the scenario. 

## What was your development environment when you engineered this scenario? 

I ran through this procedure on a (remove whatever doesn't apply - no expectation that you did this on all options):

* Win
* Mac
* Linux
* container
* VM

You generally interact with the environment with:

* keyboard short cuts - please use those when describing a task - just once - not exhaustively
* Command palatte in VSCode
* Bash commands that you developed to short-circuit longer commands
* etc

If the person writing up the steps doesn't understand how to get from A to C because your B was not obvious - that is what I'm looking for here. 

## Security/Identity considerations

Any information about what is provided for security/identity and what is not. 

* RBAC
* Easy auth
* MSAL
* VNet
* Firewalls
* CORS
* AAD apps
* 3rd party auth (GitHub, Stripe, etc)

## Pipeline/automation considerations

What automation is used to complete this scenario?

* Resource management scripts (Az CLI, AZD cli, SWA CLI, Func CLI, PowerShell)
* GitHub Actions, Azure DevOps Pipelines
* AAD automation
* Custom or 3rd party automation
    * GH CLI
    * Stripe CLI
    * Mongo CLI
* Any `hidden` or poorly known areas such as https://resources.azure.com - explain why you needed it so that can translate into content. 

All automation must include cleanup/teardown scripts

## Verify scenario

This scenario must have steps so that a customer can know they have completed it successfully, so an end state that can be validated. 

Examples could include:

* an API response
* a web site image
* a set of test files generated as part of playwright

## Troubleshooting

What issues did you come across that the customer may also hit? 

Examples include: 

* You forgot a config step and that resulted in an error in a certain task
* The SDK or CLI returned an confusing error.
* The SDK reference docs example would have been more helpful it it included ... please include exact link to ref doc.
* The pricing tier (free or basic) didn't support your scenario
* The portal or UI was confusing and would have been more helpful if the button/textbox/etc was boxed and had an error. 

## What surprised you about the scenario? 

It was hard, easy, you loved the code but hated the ....

Have an opinion that I could invoke with a tone or point where a customer needs to be more careful at certain steps. 

## What terminology restrictions should be used? 

If there are specific constraints on terminology dos/don'ts, please call them out. 

## References

What websites did you use to complete this work? What were you looking for when you went to these websites? I usually keep this as a running list in my dev diary. 

They don't have to be microsoft properties, but it would be helpful to know if/when MS content was incomplete and how it was incomplete. 
