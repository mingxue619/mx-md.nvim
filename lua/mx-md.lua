local util = require("mx-md.util")
local M = {}

M.setupOption = function(opt)
	vim.g.mxmd_port = opt.port;
	vim.g.mxmd_browser = opt.browser;
end
M.setupCommand = function(opt)
	vim.api.nvim_create_user_command("MXMDPreview", function(res)
		util.perview()
	end, {})
	vim.api.nvim_create_user_command("MXMDOpenBrowser", function(res)
		util.openBrowser()
	end, {})
	vim.api.nvim_create_user_command("MXMDRestart", function(res)
		util.restart()
	end, {})
	vim.api.nvim_create_user_command("MXMDStop", function(res)
		util.stop()
	end, {})
end
M.setup = function(opt)
	M.setupOption(opt)
	M.setupCommand(opt)
end

return M
