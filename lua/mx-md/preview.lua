local M = {}

-- function M.preview(cfg)
-- 	print("mxmd preview!")
-- 	local node_cmd = "node demo.mjs"
-- 	-- Start the Node.js process
-- 	local job_id = vim.fn.jobstart(node_cmd, {
-- 		cwd = vim.fn.getcwd(),
-- 		on_stdout = function(job_id, data, event)
-- 			-- Handle stdout if needed
-- 		end,
-- 		on_stderr = function(job_id, data, event)
-- 			-- Handle stderr if needed
-- 		end,
-- 		on_exit = function(job_id, exit_code, event)
-- 			-- Handle exit if needed
-- 		end,
-- 	})
--
-- 	local message = "Hello from Neovim!"
-- 	vim.fn.chansend(job_id, message)
-- end
function M.preview()
	-- 获取 v:servername 的值
	local servername = vim.v.servername
	-- print('Server Name: '..tostring(servername))

	local pid = vim.fn.getpid()
	local script_path = debug.getinfo(1, "S").source:sub(2)
	-- local script_path = vim.fn.expand("<sfile>:p")
	local project_dir = script_path:match("(.*/).-/"):match("(.*/).-/")
	-- local cmd = "ALLOW_CONSOLE=1 node " .. project_dir .. "server.mjs " .. servername .. " > /tmp/nlog.txt"
	local cmd = "ALLOW_CONSOLE=1 node " .. project_dir .. "demo.mjs " .. servername .. " > /tmp/nlog.txt"
	print("cmd: " .. cmd)
	-- local job_id = vim.fn.jobstart({ "node", project_dir .. "server.mjs", ">> /tmp/nlog.txt" }, {
	local job_id = vim.fn.jobstart(cmd, {
		rpc = true,
		on_stdout = function(id, data, name)
			print("stdout: " .. table.concat(data, "\n"))
		end,
		on_stderr = function(id, data, name)
			print("stderr: " .. table.concat(data, "\n"))
		end,
		on_exit = function(id, code, event)
			print("Node process exited with code " .. code)
		end,
	})
	M.job_id = job_id
	vim.rpcnotify(job_id, "send_message", "Hello from Neovim!")
	-- vim.rpcnotify(3, "send_message", "Hello from Neovim!")
	-- rpcrequest(job_id, 'nvim_eval', '"Hello " . "world!"')
	-- rpcrequest(job_id, "nvim_eval")
	print("job_id=" .. job_id)
	-- local response vim.rpcrequest(job_id, 'nvim_eval', '"Hello " . "world!"')
end
function M.notify()
	local mxmd_node_channel_id = vim.api.nvim_get_var("mxmd_node_channel_id")
	if mxmd_node_channel_id then
		print("Channel ID:", mxmd_node_channel_id)
	    vim.rpcnotify(mxmd_node_channel_id, "send_message", "Hello from Neovim!")
	else
		print("Variable not found")
	end
end

return M
