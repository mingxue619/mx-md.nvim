local job = require("mx-md.job")
local rpc = require("mx-md.rpc")
local autocmd = require("mx-md.autocmd")

local M = {}

function M.getNodeServerStatus()
	local action = "ServerStatus"
	local current_buf = vim.api.nvim_get_current_buf()
	local status = rpc.request(action, current_buf)
	-- vim.notify("status == " .. status)
	-- print("status == " .. status)
	return status
end

function M.perview()
	local job_id = job.restart()
	autocmd.setup_autocmd()
	M.openBrowser()
end

function M.stop()
	job.stop()
end

function M.copyUrl()
	local port = vim.g.mxmd_port
	local bufnr = vim.g.mxmd_preview_bufnr
	local url = "http://localhost:" .. port .. "/page/" .. bufnr
	vim.fn.setreg("+", url)
	print(url)
end

function M.restart()
	job.restart()
	autocmd.setup_autocmd()
	-- print("port===" .. vim.g.mxmd_port .. ", bufnr===" .. vim.g.mxmd_preview_bufnr)
	M.copyUrl()
end

function M.openBrowser()
	local timer = vim.loop.new_timer()
	timer:start(
		1000,
		0,
		vim.schedule_wrap(function()
			-- vim.notify("new_timer")
			local nodeServerStatus = M.getNodeServerStatus()
			if not nodeServerStatus then
				return
			end
			local action = "OpenBrowser"
			local current_buf = vim.api.nvim_get_current_buf()
			rpc.request(action, current_buf)
			timer:close()
		end)
	)
end

return M
