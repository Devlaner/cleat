rootProject.name = "cleat-backend"

include("apps:api")
include("apps:worker")

include("libs:common")
include("libs:domain")
include("libs:persistence")
include("libs:github-client")
include("libs:enrichment")
include("libs:scanning")

